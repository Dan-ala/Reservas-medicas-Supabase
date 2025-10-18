import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

import './Signup.css'

const Signup = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechanacimiento, setFechanacimiento] = useState("");
    const [sexo, setSexo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [tipoidentificacion, setTipoidentificacion] = useState("");
    const [numerodeidentificacion, setNumerodeidentificacion] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signUpNewPatient, addPatientData } = UserAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const authResult = await signUpNewPatient(email, password);

            if (!authResult.success) {
                // If the Auth API returned an error (e.g., email already exists)
                setError(authResult.error?.message || "Error durante el registro de autenticación");
                setLoading(false);
                return;
            }

            const auth_uid = authResult.auth_uid;

            const patientData = {
                nombre,
                apellido,
                fechanacimiento,
                sexo,
                direccion,
                telefono,
                correoelectronico: email,
                tipoidentificacion,
                numerodeidentificacion
            };

            const insertResult = await addPatientData(patientData, auth_uid);

            if (insertResult.success) {
                navigate("/dashboard");
            } else {
                setError("Error al guardar los datos del paciente. Intente nuevamente.");
            }
            
        } catch (err) {
            console.error("Error inesperado en handleSignUp:", err);
            setError("Ocurrió un error inesperado. Por favor, revise la consola.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <form onSubmit={handleSignUp} className="form">
            <h2 className="title">Registro de Paciente</h2>
            <p className="subtitle">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/" id="ini">
                    Iniciar Sesión
                </Link>
            </p>

            <div className="form-row">  
                <div className="input-container ic1">
                    <input
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder=""
                        className="input"
                        value={nombre}
                        required
                    />
                    <div className="cut"></div>
                    <label className="placeholder">Nombre</label>
                </div>

                <div className="input-container ic1">
                    <input
                        onChange={(e) => setApellido(e.target.value)}
                        placeholder=""
                        className="input"
                        value={apellido}
                        required
                    />
                    <div className="cut"></div>
                    <label className="placeholder">Apellido</label>
                </div>

                <div className="input-container ic1">
                    <input
                        onChange={(e) => setFechanacimiento(e.target.value)}
                        placeholder=""
                        className="input"
                        type="date"
                        value={fechanacimiento}
                        required
                    />
                    <div className="cut"></div>
                    <label className="placeholder">DOB</label>
                </div>

                <div className="input-container ic1">
                    <input
                        onChange={(e) => setSexo(e.target.value)}
                        placeholder=""
                        className="input"
                        value={sexo}
                        required
                    />
                    <div className="cut"></div>
                    <label className="placeholder">Sexo</label>
                </div>
            </div>

            <div className="form-row">
                <div className="input-container ic1">
                    <input
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder=""
                        className="input"
                        value={direccion}
                        required
                    />
                    <div className="cut"></div>
                    <label className="placeholder">Dirección</label>
                </div>

                <div className="input-container ic1">
                    <input
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder=""
                        className="input"
                        value={telefono}
                        required
                    />
                    <div className="cut"></div>
                    <label className="placeholder">Teléfono</label>
                </div>
                <div className="input-container ic1">
                    <select
                        onChange={(e) => setTipoidentificacion(e.target.value)}
                        className="input"
                        value={tipoidentificacion}
                        required
                    >
                        <option value="">Seleccione tipo de identificación</option>
                        <option value="Registro Civil">Registro Civil</option>
                        <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                        <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                        <option value="Cédula Digital">Cédula Digital</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                        <option value="NIT">NIT</option>
                        <option value="Permiso Especial de Permanencia">Permiso Especial de Permanencia</option>
                        <option value="Permiso por Protección Temporal">Permiso por Protección Temporal</option>
                        <option value="Documento Extranjero">Documento Extranjero</option>
                    </select>
                    <div className="cut"></div>
                    <label className="placeholder">Tipo de Identificación</label>
                </div>

                <div className="input-container ic1">
                    <input
                        onChange={(e) => setNumerodeidentificacion(e.target.value)}
                        placeholder=""
                        className="input"
                        type="text"
                        value={numerodeidentificacion}
                        required
                    />
                    <div className="cut"></div>
                    <label className="placeholder">Documento</label>
                </div>
            </div>

            {/* --- Auth Fields --- */}
            <div className="form-row">
                <div className="input-container ic1">
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder=""
                        className="input"
                        value={email}
                        required
                    />
                    <div className="cut"></div>
                    <label className="placeholder">Email</label>
                </div>
                
                <div className="input-container ic1">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder=""
                        type="password"
                        className="input"
                        value={password}
                        required
                    />
                    <div className="cut"></div>
                    <label className="placeholder">Password</label>
                </div>

            </div>

            <button
                type="submit"
                disabled={loading}
                className="submit"
            >
                {loading ? "Registrando..." : "Registrar"}
            </button>

            {error && <p className="text-red-600 text-center pt-4">{error}</p>}

        </form>
        </>
    );
};

export default Signup;