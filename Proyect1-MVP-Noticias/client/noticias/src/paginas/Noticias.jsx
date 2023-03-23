import React from "react";
import { useState, useEffect, createContext } from "react";
import useNoticias from "../hooks/useNoticias";
import Noticia from "../components/Noticia";
import { useParams, useLocation } from 'react-router-dom';
import "./CSS/Noticias.css"

const Noticias = () => {
  const { noticias, obtenerNews } = useNoticias();
  const location = useLocation();
  const params = useParams();
  useEffect( () => {
    obtenerNews(params.id);
  }, [location])
  return (
    <>
      <section className="page-content">
        <section className="grid">
          {noticias ? noticias.map((noticias) => <Noticia key={noticias._id} Noticia= {noticias} />) : null}
        </section>
        <footer className="page-footer"></footer>
      </section>
    </>
  );
};

export default Noticias;
