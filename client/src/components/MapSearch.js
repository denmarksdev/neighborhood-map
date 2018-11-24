import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import sortby from 'sort-by'
import './MapSearch.css';
import GoogleMaps from './GoogleMaps';

export default class MapSearch extends Component {

    state = {
        query: '',
    }

    updateQuery = (query) => {
        this.setState({
            query: query.trim(),
            selectedLocation: null
        });

        if (this.props.onSearchUpdated){
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


    render() {
        const { locations, centerPosition } = this.props;
        const { query, selectedLocation } = this.state;

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
                <aside className="map-search-locations" >
                    <div className="map-search-filter-container">
                        <h3 className="map-search-filter-title"  >São Mateus Locations</h3>
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
                <GoogleMaps
                    locations={showingLocations}
                    centerPosition={centerPosition}
                    selectedLocation={selectedLocation}
                    onClearSelection={this.clearSelection} />
            </div>
        )
    }
}