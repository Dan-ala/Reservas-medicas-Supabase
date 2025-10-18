import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import './BookAppointment.css'

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const { 
        session, 
        getPatientProfile, 
        getDoctorsAndSpecialties, 
        addAppointment 
    } = UserAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return;
            
            try {
                const doctorsData = await getDoctorsAndSpecialties();
                if (doctorsData) {
                    setDoctors(doctorsData);
                } else {
                    setError("No se pudieron cargar los médicos disponibles.");
                }
            } catch (err) {
                setError("Error al cargar datos necesarios.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [session, getDoctorsAndSpecialties]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        if (!session) {
            setError("No hay sesión activa. Por favor, inicie sesión.");
            setLoading(false);
            return;
        }

        try {
            const patientId = await getPatientProfile(session.user.id);

            if (!patientId) {
                setError("Error: No se encontró su perfil de paciente. Contacte a soporte.");
                setLoading(false);
                return;
            }

         
            const result = await addAppointment(
                patientId, 
                parseInt(selectedDoctor), 
                date, 
                time
            );

            if (result.success) {
                setSuccessMessage("Cita agendada exitosamente!");
             
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                setError("Error al agendar la cita: " + result.error.message);
            }

        } catch (err) {
            console.error("Submission error:", err);
            setError("Ocurrió un error inesperado al agendar.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-message">Cargando formulario...</div>;
    }

    if (error && !successMessage) {
        return <div className="error-message">{error}</div>;
    }
    
    return (
        <div className='booking-container'>
            <h1>Agendar Nueva Cita</h1>
            <button onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
            <hr />

            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="booking-form">
                
           
                <label>Seleccionar Médico:</label>
                <select 
                    value={selectedDoctor} 
                    onChange={(e) => setSelectedDoctor(e.target.value)} 
                    required
                    disabled={loading}
                >
                    <option value="">-- Seleccione un Médico --</option>
                    {doctors.map((doctor) => (
                        <option key={doctor.medicoid} value={doctor.medicoid}>
                            {doctor.nombre} ({doctor.especialidades.nombre})
                        </option>
                    ))}
                </select>

        
                <label>Fecha:</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required
                    disabled={loading}
                />

             
                <label>Hora:</label>
                <input 
                    type="time" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)} 
                    required
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Agendando..." : "Confirmar Cita"}
                </button>
            </form>
        </div>
    );
};

export default BookAppointment;