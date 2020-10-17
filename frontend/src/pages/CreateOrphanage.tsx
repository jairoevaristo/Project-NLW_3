import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { FiPlus } from "react-icons/fi";
import { LeafletMouseEvent } from 'leaflet'; 

import '../styles/pages/create-orphanage.css';
import Sidebar from "../Components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";
import { useForm } from  'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  name: yup.string().required('campo obrigatorio'),
  about: yup.string().required('campo obrigatorio'),
  instructions: yup.string().required('campo obrigatorio'),
  opening_hours: yup.string().required('campo obrigatorio'),
  telephone: yup.string().required('campo obrigatorio'),
});

interface UseFormInput {
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  telephone: string;
}

export default function CreateOrphanage() {
  const { register, handleSubmit, errors } = useForm<UseFormInput>({
    resolver: yupResolver(schema)
  });
  
  const history = useHistory();
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  // const [name, setName] = useState('');
  // const [about, setAbout] = useState('');
  // const [instructions, setInstructions] = useState('');
  // const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekdens, setOpenOnWeekdens] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleMapClikc(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng

    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  async function onSubmit(data: UseFormInput) {

    const { latitude, longitude } = position;

    const info = new FormData();

    const {
      name,
      about,
      instructions,
      opening_hours,
      telephone
    } = data;
   
    info.append('name', name);
    info.append('latitude', String(latitude));
    info.append('longitude', String(longitude));
    info.append('about', about);
    info.append('telephone', telephone);
    info.append('instructions', instructions);
    info.append('opening_hours', opening_hours);
    info.append('open_on_weekends', String(open_on_weekdens));
    
    images.forEach(image => {
      info.append('images', image);
    })

    await api.post('orphanages', info);

    alert('Cadastro Realixado com sucesso!');

    history.push('/app');

    console.log(data);
  }

  function handleSelectImage(event: ChangeEvent<HTMLInputElement>) {

    if(!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });
     
    setPreviewImages(selectedImagesPreview);
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-4.9031081,-40.7690448]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClikc}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_SECRET_TOKEN}`}
              />

              { position.latitude !== 0 && (
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[
                    position.latitude, 
                    position.longitude
                  ]} 
                />
              ) }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                name="name"
                ref={register} 
              />
            <p>{errors.name?.message}</p>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="name" 
                name="about"
                maxLength={300} 
                ref={register} 
              />
            <p>{errors.about?.message}</p>
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <img src={image} alt={register.name} key={image} />
                  );
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImage} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions" 
                ref={register}
                name="instructions"
              />
              <p>{errors.instructions?.message}</p>
            </div>

            <div className="input-block">
              <label htmlFor="Telephone">Whatsapp</label>
              <input 
                id="Telephone"
                name="telephone"
                ref={register}
              />
              <p>{errors.telephone?.message}</p>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input 
                id="opening_hours"
                name="opening_hours"
                ref={register}  
              />
              <p>{errors.opening_hours?.message}</p>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={open_on_weekdens ? 'active' : ''}
                  onClick={() => setOpenOnWeekdens(true)}
                >
                    Sim
                </button>
                <button 
                  type="button"
                  className={!open_on_weekdens ? 'active' : ''}
                  onClick={() => setOpenOnWeekdens(false)}
                >
                    Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
