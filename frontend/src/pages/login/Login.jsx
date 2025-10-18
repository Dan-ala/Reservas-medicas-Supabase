import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInPatient } = UserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInPatient({email, password});

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError("Correo o contraseña incorrectos");
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error durante el inicio de sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="form">
      <h2 className="title">Iniciar Sesión</h2>
      <p className="subtitle">
        ¿No tienes una cuenta?{" "}
        <Link to="/signup" id="ini">
          Regístrate
        </Link>
      </p>

      <div className="form-row">
        <div className="input-container ic1">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder=""
            className="input"
            required
          />
          <div className="cut"></div>
          <label className="placeholder">Correo electrónico</label>
        </div>

        <div className="input-container ic1">
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder=""
            className="input"
            required
          />
          <div className="cut"></div>
          <label className="placeholder">Contraseña</label>
        </div>
      </div>

      <button type="submit" className="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      {error && <p className="text-red-600 text-center pt-4">{error}</p>}
    </form>
  );
};

export default Login;
