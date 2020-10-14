import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import happyImg from '../images/map-marker.svg';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';

import '../styles/pages/orphanages-map.css';

interface Orphanage{
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanagesMap(){

  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect( () => {
    api.get('orphanages').then( response => {
      setOrphanages(response.data);

    });
  }, []);

  return (
    <div id='page-map'>
      <aside>
        <header>
          <Link to='../'>
            <img src={happyImg} alt='Happy'/>
          </Link>

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita.</p>
        </header>
        <footer>
          <strong>Araranguá e Região</strong>
          <span>Santa Catarina</span>
        </footer>
      </aside>
      
      <Map 
        center={[-28.9435122,-49.4967188]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer 
          url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png' 
        />

        {orphanages.map(orphanage => {
          return (
            <Marker 
              key={orphanage.id}
              icon={mapIcon}
              position={[orphanage.latitude, orphanage.longitude]} 
            >
              <Popup 
                className='map-popup'
                closeButton={false}
                minWidth={240}
                maxWidth={240}
              >
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`} >
                  <FiArrowRight size={20} color='#FFF' />
                </Link>
              </Popup>
            </Marker>
          )
        })}

      </Map>
      
      <Link to='/orphanages/create' className='create-orphanage'>
        <FiPlus size={32} color='#FFF' />
      </Link>
    </div>
  );
}

export default OrphanagesMap;