import React, { Component } from 'react';
import './App.css';
import MapSearch from './components/MapSearch'
import hamburger from './hamburger.svg'

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
        address: '58 Avenue Ragueb Chohfi'
      },
      {
        title: 'São Mateus Terminal',
        lat: -23.6127191,
        lng: -46.4762177,
        address: '100 Avenue Adélia Ragueb Chohfi'
      },
      {
        title: 'Pernambucanas',
        lat: -23.6106855,
        lng: -46.4763921,
        address: '3430 Avenue Mateo Bei'
      },
      {
        title: 'Sesc Itaquera',
        lat: -23.58551340,
        lng: -46.4750152,
        address: '1000 Avenue Fernando do Espírito Santo Alves de Mattos'
      },
      {
        title: 'Bradesco ',
        lat: -23.6078391,
        lng: -46.4777606,
        address: '1365 Avenue Mateo Bei'
      },
    ]
  }

  configLocationsClicks = () => {
    let spanLocations = document.getElementsByClassName('map-search-location');
    let drawer = document.querySelector('.map-search-locations');
    for (let i = 0; i < spanLocations.length; i++) {
      spanLocations[i].addEventListener('click', () => {
        // Close offset canvas
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
      e.stopPropagation();

      if (!drawer) return;

      drawer.classList.toggle('open');
      input.focus();

    });

    buttonClose && buttonClose.addEventListener('click', function () {
      // Close offset canvas
      drawer.classList.remove('open');
    });
  }

  searchUpdated = () => {
    this.configLocationsClicks();
    this.configLocationsClicks();
  }

  mapLoaded = () => {
    this.configMenuDrawer();
  }

  render() {

    const { locations, centerPosition } = this.state;

    return (
      <div className="app">
        <header className="app-header" >
          <h2>São Mateus Locations</h2>
          <img id="app-menu" src={hamburger} alt='Hamburger Menu' ></img>
        </header>
        <MapSearch
          locations={locations}
          centerPosition={centerPosition}
          onSearchUpdated={this.searchUpdated}
          onMapLoaded={this.mapLoaded}
        />
      </div>
    );
  }
}

export default App;
