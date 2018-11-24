import React, { Component } from 'react';
import './App.css';
import MapSerach from './components/MapSearch'

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
        address: 'Avenue Fernando do Espírito Santo Alves de Mattos, 1000'
      },
      {
        title: 'Bradesco ',
        lat: -23.6078391,
        lng: -46.4777606,
        address: 'Avenue Mateo Bei, 1365'
      },
    ]
  }

  componentDidMount = () => {
    this.configMenuDrawer();
    this.configLocationsClicks();
  }

  configLocationsClicks = () => {

    let spanLocations = document.getElementsByClassName('map-search-location');
    let drawer = document.querySelector('.map-search-locations');
    for (let i = 0; i < spanLocations.length; i++) {
      spanLocations[i].addEventListener('click', () => {
        drawer.classList.remove('open');
      })

    }
  }

  configMenuDrawer() {

    let menu = document.querySelector('#app-menu');
    let drawer = document.querySelector('.map-search-locations');
    let input = document.querySelector('input');
    let buttonClose = document.querySelector('button');


    menu.addEventListener('click', function (e) {
      console.log('Abrir')
      drawer.classList.toggle('open');
      input.focus();
      e.stopPropagation();
    });

    buttonClose.addEventListener('click', function () {
      drawer.classList.remove('open');
    });
  }

  searchUpdated = () => {
    this.configLocationsClicks();
  }


  render() {

    const { locations, centerPosition } = this.state;

    return (
      <div className="app">
        <header className="app-header" >
          <h2>São Mateus Locations</h2>
          <span id="app-menu" >Menu</span>
        </header>
        <MapSerach
          locations={locations}
          centerPosition={centerPosition}
          onSearchUpdated={this.searchUpdated}
        />
      </div>
    );
  }
}

export default App;
