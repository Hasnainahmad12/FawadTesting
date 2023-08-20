    import React, { useState, useEffect } from "react";
    import AppBar from "@mui/material/AppBar";
    import Box from "@mui/material/Box";
    import { GoogleMap, StandaloneSearchBox, Marker, OverlayView , Polyline} from '@react-google-maps/api';
    import "./EventsMap.css"

    const drawerWidth = 220;
    const MapEvents = ({ locations = [] }) => {
        const [selectedMarker, setSelectedMarker] = useState({ index: null, position: null });

        // Location section 
        const [selectedLocation, setSelectedLocation] = useState();
        const GlenoldenLocation = { lat: 39.89767520, lng: -75.28280210 }; // Coordinates for GLENOLDEN

        const [searchBox, setSearchBox] = useState(null);

        const handleSearchBoxLoad = (ref) => {
            setSearchBox(ref);
        };

        const handlePlacesChanged = () => {
            if (searchBox) {
                const places = searchBox.getPlaces();
                if (places && places.length > 0) {
                    const place = places[0];
                    const newLocation = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        address: place.formatted_address,
                    };
                    setSelectedLocation(newLocation);
                }
            }
        };

        const lineCoordinates = locations
        .filter(item => item.order_lat && item.order_lng)
        .map(item => ({ lat: parseFloat(item.order_lat), lng: parseFloat(item.order_lng) }));


        // Current Location
        const [currentLocation, setCurrentLocation] = useState(null);
        useEffect(() => {
            // Get the user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCurrentLocation({ lat: latitude, lng: longitude });
                    },
                    (error) => {
                        console.log('Error getting current location:', error);
                    }
                );
            } else {
                console.log('Geolocation is not supported by this browser.');
            }
        }, []);

        const handleMapClicked = (event) => {
            const { latLng } = event;
            const latitude = latLng.lat();
            const longitude = latLng.lng();
            // Use the Geocoder service to get the address based on latitude and longitude
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                if (status === "OK" && results[0]) {
                    const address = results[0].formatted_address;
                    setSelectedLocation({ latitude, longitude, address });
                    setCurrentLocation(null);
                }
            });
        };

        const [selectedMarkerData, setSelectedMarkerData] = useState(null);

        const blueMarkerIcon = {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(40, 40),
        };

        const handleMarkerClick = (index) => {
            setSelectedMarkerData(locations[index]);
        };
        

        return (
            <div className=''>
                {/* Popup Overlay */}
                {selectedMarkerData && (
                    <div className="popup-overlay"></div>
                )}
                {/* Popup Content */}
                {selectedMarkerData && (
                    <div className="popup-large">
                        <div className="popup-header">
                            <div className="popup-title">Selected Marker Details</div>
                            <button className="popup-close" onClick={() => setSelectedMarkerData(null)}>Close</button>
                        </div>
                        <div className="popup-form">
                            <div className="form-row">
                                <label>Order Number:</label>
                                <p>{selectedMarkerData.id}</p>
                            </div>
                            <div className="form-row">
                                <label>Customer Name:</label>
                                <p>{selectedMarkerData.customerName}</p>
                            </div>
                            <div className="form-row">
                                <label>Customer city:</label>
                                <p>{selectedMarkerData.city}</p>
                            </div>
                            <div className="form-row">
                                <label>Customer ZipCode:</label>
                                <p>{selectedMarkerData.zipcode}</p>
                            </div>
                        </div>
                        <div className="popup-footer">
                            {/* Add any buttons or actions you want in the footer */}
                        </div>
                    </div>
                )}
                <Box sx={{ display: 'flex' }}>
                    <AppBar
                        className='fortrans'
                        position='fixed'
                        sx={{
                            width: { sm: `calc(100% - ${drawerWidth}px)` },
                            ml: { sm: `${drawerWidth}px` }
                        }}
                    ></AppBar>
                    <Box
                        className=''
                        sx={{
                            flexGrow: 1,
                            my: 5,
                            mx: 1,
                            width: { sm: `calc(100% - ${drawerWidth}px)` }
                        }}
                    >
                        <div className="container mx-3 mt-5" style={{ width: "100%" }}>
                            <GoogleMap
                                mapContainerStyle={{ height: '400px', width: '100%' }}
                                center={selectedLocation ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude } : GlenoldenLocation}
                                zoom={currentLocation ? 11 : 10}
                                onClick={handleMapClicked}
                            >
                                <StandaloneSearchBox onLoad={handleSearchBoxLoad} onPlacesChanged={handlePlacesChanged}>
                                    <input
                                        type="text"
                                        placeholder="Search for a location"
                                        style={{
                                            boxSizing: 'border-box',
                                            border: '1px solid transparent',
                                            width: '240px',
                                            height: '32px',
                                            padding: '0 12px',
                                            borderRadius: '3px',
                                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                                            fontSize: '14px',
                                            outline: 'none',
                                            textOverflow: 'ellipses',
                                            position: 'absolute',
                                            left: '50%',
                                            marginLeft: '-120px',
                                        }}
                                    />
                                </StandaloneSearchBox>

                                {currentLocation && <Marker position={GlenoldenLocation} />}

                                <Polyline
                                    path={lineCoordinates}
                                    options={{
                                        strokeColor: '#00FF00',
                                        strokeOpacity: 1,
                                        strokeWeight: 4,
                                    }}
                                />

                                {locations.map((item, index) => (
                                    item && item.order_lat && item.order_lng && (
                                        <Marker
                                            key={index}
                                            position={{
                                                lat: parseFloat(item.order_lat),
                                                lng: parseFloat(item.order_lng),
                                            }}
                                            icon={blueMarkerIcon} // Set the blue marker icon
                                            onClick={() => handleMarkerClick(index)}
                                            onMouseOver={() => setSelectedMarker({ index, position: { lat: parseFloat(item.order_lat), lng: parseFloat(item.order_lng) } })}
                                            onMouseOut={() => setSelectedMarker({ index: null, position: null })}
                                        />
                                    )
                                ))}
                            </GoogleMap>
                        </div>
                    </Box>
                </Box>
            </div >
        )
    }

    export default MapEvents;
