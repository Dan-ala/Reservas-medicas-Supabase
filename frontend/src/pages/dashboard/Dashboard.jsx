import './Dashboard.css'
import React, { useState, useEffect, useCallback } from 'react';
import { UserAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelMessage, setCancelMessage] = useState(null); 

    const navigate = useNavigate();

    const { 
        session, 
        getPatientAppointments, 
        getPatientProfile, 
        SignOut,
        cancelAppointment
    } = UserAuth(); 
    
    const handleSignOut = () => {
        SignOut();
        navigate('/'); 
    };

    const handleBookAppointment = () => {
        navigate('/book');
    };

    const handleCancelAppointment = async (visitaId) => {
        if (!window.confirm("¿Estás seguro de que quieres cancelar esta cita?")) {
            return;
        }

        setLoading(true);
        setCancelMessage(null);

        try {
            const result = await cancelAppointment(visitaId);
            
            if (result.success) {
                setCancelMessage("Cita cancelada exitosamente.");
                // Refetch appointments to update the list
                await fetchAppointments(); 
            } else {
                setCancelMessage("Error al cancelar la cita. Intente de nuevo.");
            }
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            setCancelMessage("Ocurrió un error inesperado al cancelar.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = useCallback(async () => {
        if (!session) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setCancelMessage(null); 

        try {
            const authUid = session.user.id;
            const patientId = await getPatientProfile(authUid); 
            
            if (!patientId) {
                setError("Error: No se encontró el perfil del paciente asociado. Asegúrate de que el registro esté completo.");
                return;
            }
            
            const data = await getPatientAppointments(patientId); 
            
            if (data) {
                setAppointments(data);
            } else {
                setAppointments([]); 
            }

        } catch (err) {
            console.error("Error in fetchAppointments:", err);
            setError("Ocurrió un error al cargar las citas. Por favor, intente de nuevo.");
        } finally {
            setLoading(false);
        }
    }, [session, getPatientAppointments, getPatientProfile]); 

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);



    if (loading) {
        return <div className="loading-message">Cargando citas...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className='dashboard-container'>
            <div className='dashboard-header'>
                <h1 className='dashboard-main-title'>Dashboard</h1>
                
                <div className='header-controls'>
                    <h2 className='welcome-message'>
                        Bienvenido, {session?.user?.email}
                    </h2>
                    <div className='header-buttons'>
                        <button 
                            className='logout-button'
                            onClick={handleSignOut}
                        >
                            Cerrar Sesión
                        </button>
                        <button
                            className="add-appointment-button"
                            onClick={handleBookAppointment}
                        >
                            Agendar Nueva Cita
                        </button>
                    </div>
                </div>
            </div>
            
            <hr/>

            {cancelMessage && (
                <div className={`message ${cancelMessage.includes('Error') ? 'error' : 'success'}`}>
                    {cancelMessage}
                </div>
            )}

            <div className="appointments-container">
                <h1 className="appointments-title">Mis Citas</h1>
                
                {appointments.length === 0 ? (
                    <div className="no-data-message">No tienes citas programadas.</div>
                ) : (
                    <div className="appointments-list">
                        {appointments.map((appointment) => (
                            <div key={appointment.visitaid} className="appointment-card">
                                <p className="card-detail">
                                    <strong>ID Cita:</strong> {appointment.visitaid}
                                </p>
                                <p className="card-detail">
                                    <strong>Fecha:</strong> {appointment.fecha}
                                </p>
                                <p className="card-detail">
                                    <strong>Hora:</strong> {appointment.hora}
                                </p>
                                <p className="card-detail">
                                    <strong>Médico:</strong> {appointment.medicos.nombre}
                                    {appointment.medicos.especialidades?.nombre && (
                                        <span>, &nbsp; {appointment.medicos.especialidades.nombre}</span>
                                    )}
                                </p>
                                
                                <button
                                    onClick={() => handleCancelAppointment(appointment.visitaid)}
                                    className="cancel-button"
                                    disabled={loading}
                                >
                                    Cancelar Cita
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;