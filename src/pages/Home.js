import { IonContent, 
          IonHeader, 
          IonPage, 
          IonTitle, 
          IonToolbar, 
          IonGrid, 
          IonRow, 
          IonCol,
          IonButton, 
          IonSelect,
          IonSelectOption,
          IonItem,
          IonLabel,
          IonCard,
          IonProgressBar,
          IonIcon
        } from '@ionic/react';
import React, {useState, useEffect, Fragment} from 'react';
import GoogleMapComponent from '../components/map'
import { Plugins } from '@capacitor/core';
import axios from 'axios'
import {FMF_API, SANITATION_API} from '../constants'
import { resetWarningCache } from 'prop-types';
import { informationCircleOutline, trash, locate } from 'ionicons/icons';
import wasteResult from './wasteResult'
import WasteResult from './wasteResult';





const Home = () => {

const { Geolocation } = Plugins;

class GeolocationObject {

    async getCurrentPosition() {
      const { Geolocation } = Plugins;
      let watch = Geolocation.watchPosition({timeout: 30000, enableHighAccuracy: true}, result => {
        if (result && result.coords) {
          setGeoLocation({ lat: result.coords.latitude, lng: result.coords.longitude})
          Geolocation.clearWatch({id: watch});
          watch = null;
        }      
      });
    }

}

const handleGetLocation = () => {
  setDropDownWard(null)
  setResult({text:null, show:false, color:null})
  setLocationLoading(true)
  let location = new GeolocationObject()
  location.getCurrentPosition()
}
  

  

  const customAlertOptions = {
    header: 'Select Ward',
    translucent: true
  };

  const [geoLocation, setGeoLocation] = useState(null)
  const [error, setError] = useState(false)
  const [geoLocationWard, setGeoLocationWard] = useState(null)
  const [dropdownWard, setDropDownWard] = useState(null)
  const [result, setResult] = useState({text:null, show:false, color:null, showButton:false})
  const [marker, setMarker] = useState({
    pos:null,
    show:false
  })
  const [link, setLink] = useState({
    show:false,
    href:null,
    html:null
  })
  const [locationLoading, setLocationLoading]=useState(false)
  const [currentWard, setCurrentWard]=useState({ward:null, source:null})
  const [showWasteResult, setShowWasteResult]=useState(false)
  const [wasteProviders, setWasteProviders]=useState({loading:false, data:true, ward:null})

  const handleSelectWard = (event) => {
    setDropDownWard(event.target.value)
    setResult({text:null, show:false, color:null, showButton:false, ward:null})
    if (event.target.value != 'all'){
        setCurrentWard({ward:event.target.value, source:'dropdown'})
    }
    else{
      setCurrentWard({ward:null, source:null})
    }
  }



  const handleWardButton = (ward) => {
    const { Browser } = Plugins;
    Browser.open({ url: 'http://fcc.gov.sl/instructor/ward-'+ward });
  }

  const handleWasteButton = (ward) => {
    setShowWasteResult(true)
  }

  const dummyWardArray = new Array(48).fill(null)


  useEffect(() => {
    if (geoLocation!=null){
    axios.get(FMF_API+'postmethod', {params:geoLocation})
    .then(res=>{
      setMarker({pos:geoLocation, show:true})
      let ward_no = res.data.result.ward
      if (res.data.result === "Nothing") {
        setResult({text:"Sorry your location seems to be out of Freetown! Please try again or use the map to explore.",show:true, color:'warning', showButton:false})
        setCurrentWard({ward:null, source:null})
      }
      else{
        setResult({text:"You're in Ward "+ward_no,show:true, color:'success', showButton:true, ward:ward_no})
        setGeoLocationWard(ward_no)
        setCurrentWard({ward:ward_no, source:'gps'})
      }
      setLocationLoading(false)
    })
    .catch(error=>{
      setResult({text:"Sorry, an error occured. Please ensure you have GPS turned on or try again later.", show:true, color:'danger',showButton:false})
      setCurrentWard({ward:null, source:null})
    })
  }
  
  }, [geoLocation])


  useEffect(() => {
    if (!!currentWard.ward){
    setWasteProviders({loading:true, data:null, ward:currentWard.ward})  
    axios.get(SANITATION_API+'api/ward/'+currentWard.ward)
    .then(res=>{
      setWasteProviders({loading:false, data:res.data, ward:currentWard.ward})
    })

    }
  }, [currentWard])



  return (
    <IonPage>
    {
  showWasteResult?
  <WasteResult setShowWasteResult={setShowWasteResult} wasteProviders={wasteProviders}/>
  :
  <Fragment>
      <IonHeader>
        <IonToolbar color='fcc'>
          <IonGrid>
            <IonRow>
              <img src='assets/logo.png' style={{height:'30px'}}/>
              <IonTitle className='header ion-text-end'>Find Me Freetown</IonTitle>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

      <IonCard className="ion-padding"> 
          <h2 className='ion-text-center'>Welcome Freetonian</h2>
          <p className='ion-text-center'>
          Don't know which ward you belong to? Don't worry!
          </p>
          <p className='ion-text-center'>
          Simply press the button below - it will take your GPS location and tell you which ward you are in.
          </p>
          <p className='ion-text-center'>
          You can also select one of the wards in the dropdown, or just touch the map to explore.
          </p>
      </IonCard>    
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonButton onClick={()=>handleGetLocation()}>
              Get Location <IonIcon icon={locate}/>
            </IonButton>
          </IonCol>
          <IonCol>
          <IonItem>
            <IonLabel>Ward</IonLabel>
            <IonSelect
              interfaceOptions={customAlertOptions}
              interface="alert"
              placeholder="All"
              onIonChange={handleSelectWard}
              name='dropdownWard'
              value={dropdownWard}
            >
              <IonSelectOption value="all">All</IonSelectOption>
            {dummyWardArray.map((item, index)=><IonSelectOption value={index+399}>{index+399}</IonSelectOption>
            )}


            </IonSelect>
          </IonItem>
          </IonCol>
        </IonRow>
      </IonGrid>
      {locationLoading?
      <IonCard className="ion-padding" color={null}>
          <IonGrid>
            <IonRow>
              Fetching your location please wait...
            </IonRow>
            <IonRow>
              <IonProgressBar type="indeterminate"></IonProgressBar>
            </IonRow>
          </IonGrid>
      </IonCard>
      :
      result.show ?
      (

        <IonCard color={result.color}>
          <IonGrid>
            <IonRow className='ion-justify-content-center' style={{marginBottom:'8px'}}>
                  <strong>{result.text}</strong>
            </IonRow>
            {result.showButton &&
            <Fragment>
            <IonRow className='ion-justify-content-center' style={{marginBottom:'8px'}}>         
            <IonButton onClick={()=>handleWardButton(geoLocationWard)} color='light' size='small'>
                <IonIcon icon={informationCircleOutline}/> Find out more about ward {geoLocationWard}    
            </IonButton>
            </IonRow>
            <IonRow className='ion-justify-content-center'>
              <IonButton onClick={()=>handleWasteButton(geoLocationWard)} color='light' size='small' >
                <IonIcon icon={trash}/>View waste collectors in ward {geoLocationWard}
              </IonButton>
            </IonRow>
            </Fragment>
            }
          </IonGrid>
        </IonCard>
  
        )
        :
        (
          dropdownWard && dropdownWard != 'all' &&
        <IonCard color={null}>
        <IonGrid>
          <IonRow className='ion-justify-content-center' style={{marginBottom:'8px'}}>         
            <IonButton onClick={()=>handleWardButton(dropdownWard)} color='light' size='small'>
                <IonIcon icon={informationCircleOutline}/> Find out more about ward {dropdownWard}    
            </IonButton>
            </IonRow>
            <IonRow className='ion-justify-content-center'>
              <IonButton onClick={()=>handleWasteButton(dropdownWard)} color='light' size='small'>
              <IonIcon icon={trash}/>View waste collectors in ward {dropdownWard}
              </IonButton>
            </IonRow>
          </IonGrid>
        </IonCard>
        )
      
      }
      <div style={{width:'80vw',height:'50vh', margin:'auto'}}>
        <GoogleMapComponent marker={marker} currentWard={currentWard}/>
      </div>  
      </IonContent>
      </Fragment>
      }
    </IonPage>
  );
};

export default Home;
