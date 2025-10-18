import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    const signUpNewPatient = async (email, password) =>{
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if(error){
            console.error("There was a problem signing up:", error)
            return {success: false, error}
        }
        const auth_uid = data.user?.id;
        return { success: true, auth_uid }; 
    }

    const signInPatient = async ({email,password}) =>{
        try{
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })
            
            if (error){
                console.error("sign in error ocurrend: ", error)
                return {success: false, error: error.message}
            }
        
            console.log("Sign in - success: ",data)
            return {success: true, data}

        }
        catch(error){
            console.error("an error ocurred: ", error)
        }
    }

    useEffect(() =>{
        supabase.auth.getSession().then(({data: {session}}) =>{
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) =>{
            setSession(session)
        })
    }, [])

    const SignOut = () =>{
        const {error} = supabase.auth.signOut() 
        if(error){
            console.error("There was an error: ", error)
        }
    }

    const addPatientData = async (patientData, auth_user_id) => {
        const patientRecord = {
            ...patientData,
            auth_user_id: auth_user_id
        };

        const { data, error } = await supabase.from("pacientes").insert([patientRecord]);
        if (error) {
            console.error("Error inserting patient data:", error);
            return { success: false, error };
        }
        return { success: true, data };
    };

    const addAppointment = async (pacienteid, medicoid, fecha, hora) => {
        const { data, error } = await supabase
            .from('visitas')
            .insert([
                { pacienteid, medicoid, fecha, hora }
            ])
            .select(); 

        if (error) {
            console.error("Error creating appointment:", error);
            return { success: false, error };
        }
        return { success: true, data };
    };

    const getPatientProfile = async (auth_uid) => {
        const { data, error } = await supabase
            .from('pacientes')
            .select('pacienteid') 
            .eq('auth_user_id', auth_uid) 
            .single(); 

        if (error) {
            console.error("Error fetching patient ID:", error); 
            return null;
        }
        return data?.pacienteid; 
    };

    const updateAppointment = async (visitaId, newAppointmentData) => {
    try {
        const { data, error } = await supabase
            .from('visitas')
            .update(newAppointmentData)
            .eq('visitaid', visitaId)
            .select();

        if (error) {
            console.error('Supabase Error updating appointment:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error during appointment update:', err);
        return { success: false, error: 'Ocurrió un error inesperado.' };
    }
};


    const getPatientAppointments = async (patientId) => {
        
        const { data, error } = await supabase
            .from('visitas') 
            .select(`
                visitaid,
                fecha,
                hora,
                pacientes(nombre),
                medicos(
                    nombre,
                    especialidades(nombre)
                )
            `)
            .eq('pacienteid', patientId)
            .order('fecha', { ascending: true });

        if (error) {
            console.error("Error fetching patient appointments:", error); 
            return null;
        }
        
        return data;
    };

    const cancelAppointment = async (visitaId) => {
    const { error } = await supabase
        .from('visitas')
        .delete()
        .eq('visitaid', visitaId); 

    if (error) {
        console.error("Error cancelling appointment:", error);
        return { success: false, error };
    }
    return { success: true };
};

const getDoctorsAndSpecialties = async () => {
    const { data, error } = await supabase
        .from('medicos')
        .select(`
            medicoid,
            nombre,
            especialidadid,
            especialidades(nombre)
        `);

    if (error) {
        console.error("Error fetching doctors and specialties:", error);
        return null;
    }
    return data;
};



    return(
        <AuthContext.Provider value={{
            session, 
            signUpNewPatient, 
            signInPatient, 
            addPatientData, 
            addAppointment,
            cancelAppointment,
            SignOut, 
            getPatientAppointments,
            getDoctorsAndSpecialties,
            getPatientProfile,
            updateAppointment
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}