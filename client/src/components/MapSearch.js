import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import sortby from 'sort-by'
import './MapSearch.css';
import GoogleMaps, { MAP_LOADED, MAP_LOADING } from './GoogleMaps';

export default class MapSearch extends Component {

    state = {
        query: '',
        mapState: MAP_LOADING
    }

    updateQuery = (query) => {
        this.setState({
            query: query.trim(),
            selectedLocation: null
        });

        if (this.props.onSearchUpdated) {
            this.props.onSearchUpdated()
        }
    }

    onSelectLocation = (location) => {
        this.setState({
            selectedLocation: location
        })
    }

    clearSelection = () => {
        this.setState({
            selectedLocation: null
        })
    }

    mapStateChanged = (mapState) => {

        const { onMapLoaded } = this.props;

        this.setState({
            mapState
        })

        if (mapState === MAP_LOADED && onMapLoaded)
            onMapLoaded();
    }

    render() {
        const { locations, centerPosition } = this.props;
        const { query, selectedLocation, mapState } = this.state;

        //Filter the locations with the search field
        let showingLocations = [];
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i');
            showingLocations = locations.filter(location => {
                return match.test(location.title)
            });
        } else {
            showingLocations = locations;
        }
        showingLocations.sort(sortby('title'))

        return (
            <div className="map-search-container">

                {mapState === MAP_LOADED &&
                    <aside className="map-search-locations" >
                        <div className="map-search-filter-container">
                            <h3 className="map-search-filter-title">Filter São Mateus Locations</h3>
                            <button className="map-search-close-button">X</button>
                        </div>
                        {/* Filter */}
                        <input
                            className="map-search-input"
                            placeholder="search locations ...."
                            value={query}
                            autoFocus
                            onChange={event => this.updateQuery(event.target.value)}
                        />
                        {/* Location List */}
                        {showingLocations.map((location, index) => (
                            <span key={index}
                                className="map-search-location"
                                onClick={() => this.onSelectLocation(location)}>
                                {location.title}
                            </span>
                        ))}
                    </aside>
                }

                <GoogleMaps
                    apiKey={'AIzaSyArtkKlhp4eIYhWpWbI5ZdBwCvkf6En11c'}
                    locations={showingLocations}
                    centerPosition={centerPosition}
                    selectedLocation={selectedLocation}
                    onClearSelection={this.clearSelection}
                    onStateChanged={this.mapStateChanged} />
            </div>
        )
    }
}