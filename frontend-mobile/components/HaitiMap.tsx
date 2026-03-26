import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useTranslation } from "react-i18next";
// Real administrative boundary data (geoBoundaries HTI-ADM1, simplified)
import geoData from "@/assets/haiti-departments.json";

function buildHtml(selectedId: string | null, labels: Record<string, string>): string {
  // Inject translated labels into each feature before sending to the map
  const geojson = {
    ...geoData,
    features: (geoData as any).features.map((f: any) => ({
      ...f,
      properties: { id: f.properties.id, label: labels[f.properties.id] ?? f.properties.id },
    })),
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width" />
  <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var SELECTED = ${JSON.stringify(selectedId)};
    var GEOJSON  = ${JSON.stringify(geojson)};

    var map = new maplibregl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-72.85, 18.97],
      zoom: 6.5,
      interactive: false,
      attributionControl: false,
    });

    map.on('load', function () {
      map.addSource('depts', { type: 'geojson', data: GEOJSON });

      // One centroid point per department for labels (avoids repeated labels on multi-ring polygons)
      map.addSource('dept-centroids', { type: 'geojson', data: centroids(GEOJSON) });

      // Choropleth fill
      map.addLayer({
        id: 'dept-fill',
        type: 'fill',
        source: 'depts',
        paint: {
          'fill-color': colorExpr(SELECTED),
          'fill-opacity': opacityExpr(SELECTED),
        },
      });

      // Boundary lines
      map.addLayer({
        id: 'dept-line',
        type: 'line',
        source: 'depts',
        paint: {
          'line-color': '#ffffff',
          'line-width': ['case', ['==', ['get', 'id'], SELECTED ?? ''], 2.5, 1],
        },
      });

      // Department labels — one per centroid point, never duplicated
      map.addLayer({
        id: 'dept-label',
        type: 'symbol',
        source: 'dept-centroids',
        layout: {
          'text-field': ['get', 'label'],
          'text-size': 11,
          'text-font': ['Noto Sans Regular'],
          'text-anchor': 'center',
          'text-allow-overlap': true,
          'text-ignore-placement': true,
          'text-max-width': 8,
        },
        paint: {
          'text-color': ['case', ['==', ['get', 'id'], SELECTED ?? ''], '#ffffff', '#1e3a5f'],
          'text-halo-color': ['case', ['==', ['get', 'id'], SELECTED ?? ''], '#001F5B', '#ffffff'],
          'text-halo-width': 1.5,
        },
      });

      // Tap / click handler
      map.on('click', 'dept-fill', function (e) {
        var id = e.features[0].properties.id;
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dept', id: id }));
      });
    });

    // Compute one centroid Point per feature (uses the largest ring to handle islands)
    function centroids(geojson) {
      return {
        type: 'FeatureCollection',
        features: geojson.features.map(function(f) {
          var geom = f.geometry;
          // For MultiPolygon pick the ring with the most coordinates (main landmass)
          var ring;
          if (geom.type === 'MultiPolygon') {
            ring = geom.coordinates.reduce(function(best, poly) {
              return poly[0].length > best.length ? poly[0] : best;
            }, []);
          } else {
            ring = geom.coordinates[0];
          }
          var lon = 0, lat = 0;
          for (var i = 0; i < ring.length; i++) { lon += ring[i][0]; lat += ring[i][1]; }
          lon /= ring.length; lat /= ring.length;
          return {
            type: 'Feature',
            properties: f.properties,
            geometry: { type: 'Point', coordinates: [lon, lat] },
          };
        }),
      };
    }

    // Expression helpers
    function colorExpr(id) {
      return ['case', ['==', ['get', 'id'], id ?? ''], '#001F5B', '#CBD5E1'];
    }
    function opacityExpr(id) {
      return ['case', ['==', ['get', 'id'], id ?? ''], 0.8, 0.45];
    }

    // Called from React Native via injectJavaScript when selection changes
    function setSelected(id) {
      SELECTED = id;
      if (!map.isStyleLoaded()) return;
      map.setPaintProperty('dept-fill', 'fill-color',   colorExpr(id));
      map.setPaintProperty('dept-fill', 'fill-opacity', opacityExpr(id));
      map.setPaintProperty('dept-line', 'line-width',
        ['case', ['==', ['get', 'id'], id ?? ''], 2.5, 1]);
      map.setPaintProperty('dept-label', 'text-color',
        ['case', ['==', ['get', 'id'], id ?? ''], '#ffffff', '#1e3a5f']);
      map.setPaintProperty('dept-label', 'text-halo-color',
        ['case', ['==', ['get', 'id'], id ?? ''], '#001F5B', '#ffffff']);
    }
  </script>
</body>
</html>`;
}

interface Props {
  selectedDeptId: string | null;
  onSelectDepartment: (id: string) => void;
}

export default function HaitiMap({ selectedDeptId, onSelectDepartment }: Props) {
  const { t, i18n } = useTranslation();
  const webViewRef = useRef<WebView>(null);

  const labels = Object.fromEntries(
    ["OU","GA","NI","SE","NW","NO","NE","CE","AR","SU"].map((id) => [
      id,
      t(`departments.${id}`),
    ])
  );

  // Sync selection without reloading the WebView
  useEffect(() => {
    webViewRef.current?.injectJavaScript(
      `if(typeof setSelected==='function') setSelected(${JSON.stringify(selectedDeptId)}); true;`
    );
  }, [selectedDeptId]);

  return (
    <View style={styles.wrapper}>
      <WebView
        ref={webViewRef}
        // Rebuild when language changes so labels update
        key={i18n.language}
        source={{ html: buildHtml(selectedDeptId, labels) }}
        style={styles.map}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        onMessage={(e) => {
          try {
            const data = JSON.parse(e.nativeEvent.data);
            if (data.type === "dept") onSelectDepartment(data.id);
          } catch {}
        }}
      />

      {!selectedDeptId && (
        <View style={styles.indicator}>
          <Text style={styles.hintText}>
            {t("projets_screen.tap_dept_hint")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  map: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    overflow: "hidden",
  },
  indicator: {
    marginTop: 8,
    alignItems: "center",
  },
  hintText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
