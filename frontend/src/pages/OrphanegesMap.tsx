import React,{ useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import mapMarkImg from '../assets/images/map-mark.svg'
import '../styles/pages/orphagenes-map.css';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanegesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useEffect(() => {
      api.get('/orphanages').then(response => {
        setOrphanages(response.data);
      });
    }, []);

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkImg} alt="Happy" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Visite orfanatos e mude o dia de muitas crianças.</p>
                </header>

                <footer>
                    <strong>Ipaporanga</strong>
                    <span>Ceará</span>
                </footer>
            </aside>
            <Map 
                center={[-4.9031081,-40.7690448]}
                zoom={15}
                style={{ width: '100%', height: '100%' }}
            >
                {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_SECRET_TOKEN}`} />

            {orphanages.map((orphanage) => {
              return (
                <Marker 
                  key={orphanage.id}
                  icon={mapIcon}
                  position={[orphanage.latitude, orphanage.longitude]} 
                >
                <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                    {orphanage.name}
                    <Link to={`/orphanages/${orphanage.id}`}>
                        <FiArrowRight size={20} color="#fff" />
                    </Link>
                </Popup>
            </Marker>
              )
            })}
            </Map>

            <Link to="/orphanages/create" className="create-orghanage">
                <FiPlus size={32} color="#fff"/>
            </Link>
        </div>
    );
}

export default OrphanegesMap;