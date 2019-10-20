import React, {useState, useEffect} from 'react';
import {IonContent, IonHeader, IonSpinner, IonToolbar, IonAlert, IonList, IonIcon, IonTitle, IonButtons, IonBackButton,IonGrid,IonRow,IonCol, IonButton,  IonAvatar, IonItem, IonLabel } from '@ionic/react';
import { Fragment } from 'react';
import { call } from 'ionicons/icons';
import { CallNumber } from '@ionic-native/call-number';



const WasteResult = (props) => {


const [tab, setTab] = useState('solid')
const [solidProviders, setSolidProviders]=useState(null)
const [liquidProviders, setLiquidProviders]=useState(null)
const [alert, setAlert]=useState({show:false, number:null, name:null})



const handleBack = () => {
    props.setShowWasteResult(false)
}

const callNow = (number) => {
    CallNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

const handleCall = (provider) => {
    setAlert({show:true, number:provider.number, name:provider.name})
}

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

useEffect(() => {
    if (!!props.wasteProviders.data){
        let solidArr = []
        let liquidArr = []
        props.wasteProviders.data.map((provider)=>{
            if (provider.type==='Solid Waste'){
                solidArr.push(provider)
            }
            else{
                liquidArr.push(provider)
            }
        })
        setSolidProviders(solidArr)
        setLiquidProviders(liquidArr)
    }
}, [props.wasteProviders.data])

return(
<Fragment>
    <IonHeader>
    <IonToolbar>
        <IonButtons slot="start">
        <IonBackButton onClick={handleBack} />
        </IonButtons>
        <IonTitle>
            Waste Collectors in Ward {props.wasteProviders.ward}
        </IonTitle>
    </IonToolbar>
    </IonHeader>
    <IonContent>
        <IonGrid>
            <IonRow>
                <IonCol>
                    <IonButton expand="block" color={tab==='solid'?'primary':'light'} onClick={()=>setTab('solid')}>Solid Waste</IonButton>
                </IonCol>
                <IonCol>
                    <IonButton expand="block" color={tab==='liquid'?'primary':'light'} onClick={()=>setTab('liquid')}>Liquid Waste</IonButton>
                </IonCol>
            </IonRow>
        </IonGrid>
        {
            props.wasteProviders.loading?
            <IonGrid>
                <IonRow className='ion-justify-content-center'>
                <span className='ion-margin'>Loading please wait...</span>
                </IonRow>
                <IonRow className='ion-justify-content-center'>
                <IonSpinner name="dots" className='ion-margin-top' />
                </IonRow>
            </IonGrid>
            :

            tab === 'solid' && (solidProviders &&
            <IonList>
            {solidProviders.map((provider, index)=>(
                <IonItem key={index} onClick={()=>handleCall(provider)}>
                    <IonAvatar slot="start">
                    <img src="assets/icon/favicon.png"/>
                    </IonAvatar>
                    <IonLabel>
                    <h2>{provider.name}</h2>
                    <h3>{capitalize(provider.equipment)}</h3>
                    <p>{provider.address}</p>
                    </IonLabel>
                    <IonIcon slot="end" icon={call}/>
                </IonItem>
            ))}
            </IonList>
            )
                    
            ||

            tab === 'liquid' && (liquidProviders &&
            <IonList>    
            {liquidProviders.map((provider, index)=>(
                <IonItem key={index} onClick={()=>handleCall(provider)}>
                    <IonAvatar slot="start">
                    <img src="assets/icon/favicon.png"/>
                    </IonAvatar>
                    <IonLabel>
                    <h2>{provider.name}</h2>
                    <h3>{capitalize(provider.equipment)}</h3>
                    <p>{provider.address}</p>
                    </IonLabel>
                    <IonIcon slot="end" icon={call}/>
                </IonItem>
            ))}
            </IonList>
            )

    }    
    <IonAlert
          isOpen={alert.show}
          onDidDismiss={() => setAlert({show:false, number:null, name:null})}
          header={'Call Provider'}
          subHeader={alert.name}
          message={alert.number}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            },
            {
              text: 'Call',
              handler: () => {
                callNow(alert.number)
              }
            }
          ]}
    />

    </IonContent>   
</Fragment>    
)
}

export default WasteResult