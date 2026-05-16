var Geo = {
        forwardGeocode: async (config) => {
          const features = [];
          try {
            const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
            const response = await fetch(request, {
              headers: {
                'User-Agent': 'MyListingApp'
              }
            });
            const geojson = await response.json();
            for (const feature of geojson.features) {
              const center = [ 
                feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2, 
                feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2 
              ];
              return center;
            }
          } catch (e) {
            console.error(`Failed to forwardGeocode with error: ${e}`);
          }
        }
      };
      module.exports=Geo;