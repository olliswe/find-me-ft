import React, {useEffect, useState, Fragment} from 'react'
import { GoogleMap, LoadScript , Marker, Polygon, InfoWindow} from '@react-google-maps/api'
import layerJSON from '../layer'
import { Plugins } from '@capacitor/core';
import { open } from 'ionicons/icons';
import {IonIcon} from '@ionic/react';





const wardPolygons = () => {
  let wardArr = []
  layerJSON.features.map((regionJ,index) => {
    let coordinates = regionJ.geometry.coordinates[0]
    let coordArr = []
    coordinates.map(coordinate => {
      coordArr.push({lat:parseFloat(coordinate[1]), lng:parseFloat(coordinate[0])})
    })
    wardArr.push({
                  index:index,
                  ward:index+399,
                  center:regionJ.properties.center,
                  polygon: <Polygon
                  key = {index}
                  path={coordArr} 
                  options={{
                    fillColor: "blue",
                    fillOpacity: 0.2,
                    strokeColor: "blue",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    clickable: false,
                    draggable: false,
                    editable: false,
                    geodesic: false,
                    zIndex: 1.5,
                  }}
                  />
    })
})

  return wardArr
}






const GoogleMapComponent = (props) => {

  const [wardArr, setWardArr] = useState(wardPolygons())
  const [currentPolygon, setCurrentPolygon] = useState(null)
  const [currentInfoWindow, setCurrentInfoWindow] = useState(null)
  const [currentCenter, setCurrentCenter] = useState({ lat: 8.464900, lng: -13.231235})
  const [currentZoom, setCurrentZoom] = useState(11)

  const handleClick = (ward, center) =>{
    setCurrentCenter(center)
    setCurrentInfoWindow(
      <InfoWindow
      position={center}
      key={Math.random()}
      >
        <span  onClick={() => openBrowser(ward)}><IonIcon icon={open}/>&nbsp;{ward}</span>
    </InfoWindow>
    )
    setCurrentPolygon((wardArr.find(x => x.ward == ward).polygon))
  }
  
  const openBrowser = (ward) => {
    const { Browser } = Plugins;
    Browser.open({ url: 'http://fcc.gov.sl/instructor/ward-'+ward });
  }

  useEffect(() => {
    if (!!props.currentWard.ward){
    setCurrentPolygon((wardArr.find(x => x.ward == props.currentWard.ward).polygon))
    if (props.currentWard.source == 'dropdown'){
      let wardCenter = wardArr.find(x=>x.ward == props.currentWard.ward).center
      setCurrentCenter(wardCenter)
      setCurrentZoom(13)
      setCurrentInfoWindow(
        <InfoWindow
        position={wardCenter}
        key={Math.random()}
        >
          <span  onClick={() => openBrowser(props.currentWard.ward)}><IonIcon icon={open}/>&nbsp;{props.currentWard.ward}</span>
      </InfoWindow>
      )
    }
  }
    else{
      setCurrentCenter({ lat: 8.464900, lng: -13.231235})
      setCurrentZoom(11)
      setCurrentInfoWindow(null)
      setCurrentPolygon(null)
    }


    
  }, [props.currentWard])

  useEffect(()=>{

  })

  useEffect(()=>{
    if (!!props.marker.pos){
      setCurrentCenter(props.marker.pos)
      setCurrentZoom(16)
      }
  }, [props.marker])
  

  const renderLayer = () => {
  
    return (
      layerJSON.features.map((regionJ,index) => {
        let coordinates = regionJ.geometry.coordinates[0]
        let coordArr = []
        coordinates.map(coordinate => {
          coordArr.push({lat:parseFloat(coordinate[1]), lng:parseFloat(coordinate[0])})
        })
        let ward = index+399
        let center = regionJ.properties.center
        return (
        <Fragment>
        <Polygon
        onClick={()=>handleClick(ward, center)}
        key = {index}
        path={coordArr} 
        options={{
          fillColor: "grey",
          fillOpacity: 0.2,
          strokeColor: "grey",
          strokeOpacity: 1,
          strokeWeight: 1,
          clickable: true,
          draggable: false,
          editable: false,
          geodesic: false,
          zIndex: 1,
        }}
        />
      </Fragment>  
        )
      })
    )
  }
  
  
    return (
            <LoadScript
              id="script-loader"
              googleMapsApiKey='AIzaSyDgLo_BdpIcvd1CaVMpE4uCSXenKBGWabk'
            >
              <GoogleMap
                id='example-map'
                center={currentCenter}
                zoom={currentZoom}
                mapContainerStyle={{width:'100%',height:'100%'}}
              >
            {
           props.marker.show && 
            <Marker
            name={'Your Location'}
            position={props.marker.pos}
             />
           }
           {renderLayer()}
           {
             currentPolygon && currentPolygon
           }
            {
             currentInfoWindow && currentInfoWindow
           }
          </GoogleMap>
            </LoadScript>
           )
}

export default GoogleMapComponent;





















// import React, {useEffect} from 'react'
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


// const mapStyles = {
//     width: '80vw',
//     height: '50vh',
//     margin:'auto',
//     marginTop:'0px'
//   };
  


// const GoogleMapComponent = (props) => {




//     return (
//         <Map
//           google={props.google}
//           zoom={props.marker.show ? 18 : 11}
//           style={mapStyles}
//           center={props.marker.show ? props.marker.pos :{ lat: 8.464900, lng: -13.231235}}
//           initialCenter = {{ lat: 8.464900, lng: -13.231235}}
//         >
//           {
//             props.marker.show && 
//             <Marker
//             name={'Your Location'}
//             position={props.marker.pos}
//             />
//           }
//         </Map>  
//     );
// }

// export default GoogleApiWrapper({
//     apiKey: 'AIzaSyDgLo_BdpIcvd1CaVMpE4uCSXenKBGWabk'
//   })(GoogleMapComponent);