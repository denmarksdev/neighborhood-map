import React, { Component } from 'react';
import './App.css';
import GoogleMap from './components/GoogleMap'




class App extends Component {

  
  state = {
    centerPosition: {
      lat: -23.6117702,
      lng: -46.4746064,
    },
    locations: [
      {
        title: 'Assai Wholesaler',
        lat: -23.6117702,
        lng: -46.4746064,
        address: 'Avenue Ragueb Chohfi, 58'
      },
      {
        title: 'São Mateus Terminal',
        lat: -23.6127191,
        lng: -46.4762177,
        address: 'Avenue Adélia Ragueb Chohfi, 100'
      },
      {
        title: 'Pernambucanas',
        lat: -23.6106855,
        lng: -46.4763921,
        address: 'Avenue Mateo Bei, 3430'
      },
      {
        title: 'Sesc Itaquera',
        lat: -23.58551340,
        lng: -46.4750152,
        address:'Avenue Fernando do Espírito Santo Alves de Mattos, 1000'
      },
      {
        title: 'Bradesco ',
        lat: -23.6078391,
        lng: -46.4777606,
        address: 'Avenue Mateo Bei, 1365'
      },
    ]
  }


  render() {

    const { locations, centerPosition } = this.state;

    return (
      <div className="App">
        <GoogleMap
          locations={locations}
          centerPosition ={centerPosition}
        />
      </div>
    );
  }
}

export default App;
