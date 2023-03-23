import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import io from "socket.io-client";

const NoticiasContext = createContext();

const NoticiasProvider = ({ children }) => {
  const [noticias, setNoticias] = useState([]);
  const [newsSouce, setNewsSouce] = useState([]);
  const [newSouce, setNewSouce] = useState([]);
  const [alerta, setAlerta] = useState({});
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const obtenerNewsSource = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await clienteAxios("/newsource", config);
        setNewsSouce(data);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerNewsSource();
  }, [auth]);

  useEffect(() => {
    obtenerNews();
  }, [auth]);

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);

    setTimeout(() => {
      setAlerta({});
    }, 5000);
  };
  const obtenerNews = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !auth?._id) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      if (id) {
        const { data } = await clienteAxios(`/news/categoria/${id}`, config);
        setNoticias(data);
        return;
      }
      const { data } = await clienteAxios(`/news/${auth._id}`, config);
      setNoticias(data);
    } catch (error) {
      console.log(error);
    }
  };
  const submitNewSource = async (newSouce) => {
    if (newSouce.id) {
      await editarNewSource(newSouce);
    } else {
      await nuevoNewSource(newSouce);
    }
  };

  const nuevoNewSource = async (newSouce) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post(`/newsource`, newSouce, config);
      console.log(data);
      // Sincronizar el state
      //const newSourcesActualizados = newSouce.map(newSourcesState => newSourcesState._id === data._id ? data : newSourcesState)
      //setProyectos(newSourcesActualizados)

      setAlerta({
        msg: "News Source creado Correctamente",
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  const subirNewSource = async (newSouce) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(config);
      const { data } = await clienteAxios.post(
        `/newsource/${newSouce._id}/process`,
        newSouce,
        config
      );
      console.log(data);
      // Sincronizar el state
      //const newSourcesActualizados = newSouce.map(newSourcesState => newSourcesState._id === data._id ? data : newSourcesState)
      //setProyectos(newSourcesActualizados)

      setAlerta({
        msg: "News Source creado Correctamente",
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const editarNewSource = async (newSouces) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.put(
        `/newsource/${newSouces.id}`,
        newSouces,
        config
      );

      // Sincronizar el state
      const newSourcesActualizados = newsSouce.map((newSourcesState) =>
        newSourcesState._id === data._id ? data : newSourcesState
      );
      setNewsSouce(newSourcesActualizados);

      setAlerta({
        msg: "News Source Actualizado Correctamente",
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarNewSorce = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.delete(`/newsource/${id}`, config);

      // Sincronizar el state
      const newSourceActualizados = newsSouce.filter(
        (newSouce) => newSouce._id !== id
      );
      setNewSouce(newSourceActualizados);

      setAlerta({
        msg: data.msg,
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerNewSource = async (id) => {
    //setCargando(true)
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios(`/newsource/${id}`, config);
      setNewSouce(data);
      setAlerta({});
    } catch (error) {
      navigate("/dashboard");
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } finally {
    }
  };
  return (
    <NoticiasContext.Provider
      value={{
        noticias,
        mostrarAlerta,
        alerta,
        submitNewSource,
        newsSouce,
        newSouce,
        obtenerNews,
        subirNewSource,
        obtenerNewSource,
        eliminarNewSorce,
      }}
    >
      {children}
    </NoticiasContext.Provider>
  );
};
export { NoticiasProvider };

export default NoticiasContext;
