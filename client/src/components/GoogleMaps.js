import React, { Component } from 'react';
import './GoogleMaps.css';
import FlickerAPI from '../api/FlikerAPI'
import ErrorMessage from '../components/ErrorMessage'

const flickerAPI = new FlickerAPI();

export const MAP_LOADING = 'mapLoading';
export const MAP_LOADED = 'mapLoaded';
export const MAP_ERROR = 'mapError';

const MAP_SCRIPT_ERROR = 'mapScriptError';

export default class GoogleMaps extends Component {

    state = {
        mapStatus: MAP_LOADING,
        markers: new Map(),
        selected: this.props.selectedLocation
    }

    componentDidMount() {
        // Dynamically importing scripts asynchronously 
        window.initMap = this.initMap;
        window.gm_authFailure = this.gm_authFailure;
        var script = loadJS(`https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}&callback=initMap`)
        
        // The onerror attribute fires when an error occurs while loading an external file
        script.onerror = this.loadScriptError;
    }

    componentDidUpdate() {
        const { markers, infoWindow } = this.state;
        const { selectedLocation, locations } = this.props;

        // Clean maps marks configuration after each update
        if (infoWindow)
            infoWindow.close();

        markers.forEach(marker => marker.visible = false);

        // Define visibility of previus configured marks on map
        if (locations)
            locations.forEach(location => {
                if (markers.has(location.title)) {
                    markers.get(location.title).visible = true;
                }
            })

        // Animate marker when marker is selected a an external component
        markers.forEach(marker => {
            if (selectedLocation && (selectedLocation.title === marker.title)) {
                marker.setAnimation(window.google.maps.Animation.BOUNCE);
                window.google.maps.event.trigger(marker, 'click');
            } else {
                marker.setAnimation(null);
            }
        })
    }

    sendStatusChanged = (mapStatus) => {
        const {onStateChanged} = this.props;
        if (onStateChanged) 
             onStateChanged(mapStatus);
    }
    
    loadScriptError = (oError) => {
        console.log("The script " + oError.target.src + " didn't load correctly.");
        this.setState({
            mapStatus: MAP_SCRIPT_ERROR
        })
        
        this.sendStatusChanged(MAP_ERROR);
    }

    // Listening for authentication errors Google Maps
    gm_authFailure = () => {
        this.setState({
            mapStatus: MAP_ERROR
        })

        this.sendStatusChanged(MAP_ERROR);
    }

    initMap = () =>  {
        const { locations, centerPosition, onClearSelection } = this.props;

        this.sendStatusChanged(MAP_LOADED);

        this.setState({
            mapStatus: MAP_LOADED
        })

        // Create Google Map
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: centerPosition,
            zoom: 15,
        });

        // Display information of marker
        const infoWindow = new window.google.maps.InfoWindow()

        infoWindow.addListener('closeclick', () => {
            onClearSelection();
        })

        // Close the marks by clicking on the map
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

                    flickerAPI.getFoto(marker.title).then(urlImage => {
                        // Display location information with Flickr image
                        const markerHTML = `
                            <di>
                                <h3>${marker.title}</h3>
                                <figure>
                                    <img class='map-image' src='${urlImage}'>
                                    <figcaption> Photo on <a target='_blank' href='https://www.flickr.com'>Flickr</a></figcaption>
                                </figure>
                                <p>${marker.address}</p>
                            </div>`
                        infoWindow.setContent(markerHTML);
                        infoWindow.open(map, marker);
                    }).catch(err => {
                        console.log(err);
                        //  Could not load Flicker images
                        const markerHTML =
                            `<h3>${marker.title}</h3>
                            <p class='map-error' >Photo not found on flicker</p>
                            <p>${marker.address}</p>`
                        infoWindow.setContent(markerHTML);
                        infoWindow.open(map, marker);
                    })
                })
                markers.set(marker.title, marker);
            });
        }
        // Load markers only once for best performance
        this.setState({
            markers,
            infoWindow
        })
    }


    render() {
        const { mapStatus } = this.state;

        switch (mapStatus) {
            case MAP_LOADING:
                return <h1>Loading ....</h1>
            case MAP_SCRIPT_ERROR:
                 return <ErrorMessage 
                            title='Google Script error' 
                            message="The google script didn't load correctly." />
            case MAP_ERROR:
                return <ErrorMessage 
                            title='Google Maps API Authentication' 
                            message='The Google Maps API can not be loaded,
                                     try to make a hard refresh in the web browser, 
                                     in case the problem persists contact the web developer.' />
            default:
                return <main id="map"></main>
        }
    }

}
// Code Reference : https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
    return script;
}