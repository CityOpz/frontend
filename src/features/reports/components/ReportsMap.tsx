import L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import markerIconUrl from "leaflet/dist/images/marker-icon.png"
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png"
import type { MapReport } from "../types/map-report.types"
import "leaflet/dist/leaflet.css"

interface ReportsMapProps {
  readonly reports: readonly MapReport[]
}

const BOGOTA_CENTER: [number, number] = [4.68, -74.07]

const reportMarkerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export function ReportsMap({ reports }: ReportsMapProps) {
  return (
    <MapContainer
      center={BOGOTA_CENTER}
      className="h-full min-h-[480px] w-full"
      scrollWheelZoom
      zoom={12}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {reports.map((report) => (
        <Marker
          key={report.id}
          icon={reportMarkerIcon}
          position={[report.coordinates[0], report.coordinates[1]]}
          title={report.title}
        >
          <Popup>
            <article className="min-w-52">
              <p className="mb-1 text-xs font-bold text-blue-700">{report.id}</p>
              <h3 className="m-0 text-sm font-bold text-slate-900">
                {report.title}
              </h3>
              <p className="my-2 text-xs text-slate-600">{report.category}</p>
              <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                {report.status}
              </span>
            </article>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
