import React, { Component } from 'react';
import './GoogleMap.css';

export default class GoogleMap extends Component {

    state = {
        isLoaded: false,
        markers: new Map(),
        selected: this.props.selectedLocation
    }

    componentDidMount() {
        this.renderMap()
    }

    componentDidUpdate() {

        const { markers, infoWindow } = this.state;
        const { selectedLocation, locations } = this.props;

        if (infoWindow)
            infoWindow.close();

        markers.forEach(marker => marker.visible = false);

        if (locations)
            locations.forEach(location => {
                if (markers.has(location.title)) {
                    markers.get(location.title).visible = true;
                }
            })


        markers.forEach(marker => {
            if (selectedLocation && (selectedLocation.title === marker.title)) {
                marker.setAnimation(window.google.maps.Animation.BOUNCE);
                window.google.maps.event.trigger(marker, 'click');
            } else {
                marker.setAnimation(null);
            }
        })
    }

    renderMap = () => {
        initScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyArtkKlhp4eIYhWpWbI5ZdBwCvkf6En11c&callback=initMap')
        window.initMap = this.initMap;
    }


    initMap = () => {

        if ( typeof window.google === 'objec' && typeof window.google.maps === 'object') {
            this.setState({
                isLoaded: true
            })
        }

        const { locations, centerPosition, onClearSelection } = this.props;

        // Create Google Map

        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: centerPosition,
            zoom: 15,
        });

        // Display information of marker

        const infoWindow = new window.google.maps.InfoWindow()

        map.addListener('click', () => {

            this.state.infoWindow.close();

            if (onClearSelection)
                onClearSelection();

            this.setState({
                selected: null
            })

        })

        // Create Marker with locations

        let markers = new Map();

        if (locations) {
            locations.forEach(location => {

                let marker = new window.google.maps.Marker({
                    position: { lat: location.lat, lng: location.lng },
                    title: location.title,
                    map,
                    address: location.address
                })

                marker.addListener('click', () => {
                    const markerHTML = `<h3>${marker.title}</h3><p>${marker.address}</p>`
                    infoWindow.setContent(markerHTML);
                    infoWindow.open(map, marker);
                })

                markers.set(marker.title, marker);
            });
        }


        this.setState({
            markers,
            infoWindow
        })
    }


    render() {

        

        return (
            <main id="map">
            </main>
        )
    }

}


function initScript(url) {
    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.async = true;
    scriptTag.defer = true;
    document.getElementsByTagName('body')[0].appendChild(scriptTag);
}