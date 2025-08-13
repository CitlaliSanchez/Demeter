import { supabase } from '../sbClient';

export const registerUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'myapp://auth-callback' // Para deep linking en móvil
      }
    });

    if (error) {
      console.error('Error en registro:', error);
      throw new Error(error.message || 'Error al registrar usuario');
    }

    return data.user;
  } catch (error) {
    console.error('Error completo en registerUser:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Credenciales incorrectas');
    }

    if (!data.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      throw new Error('Por favor verifica tu correo antes de iniciar sesión');
    }

    return data.user;
  } catch (error) {
    console.error('Error completo en loginUser:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error en logout:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};