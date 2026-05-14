import './App.css'
import shirtImage from './assets/shirt.svg'
import pantsImage from './assets/pants.svg'
import dressImage from './assets/dress.svg'
import jacketImage from './assets/jacket.svg'

type Garment = {
  id: number
  nom: string
  image: string
  lave: boolean
  paye: boolean
  prix: number
  disponible: boolean
}

const garments: Garment[] = [
  { id: 1, nom: 'Chemise blanche', image: shirtImage, lave: true, paye: true, prix: 8, disponible: true },
  { id: 2, nom: 'Pantalon noir', image: pantsImage, lave: false, paye: false, prix: 10, disponible: false },
  { id: 3, nom: 'Robe rouge', image: dressImage, lave: true, paye: false, prix: 12, disponible: true },
  { id: 4, nom: 'Veste en laine', image: jacketImage, lave: false, paye: true, prix: 15, disponible: false },
]

function App() {
  const availableGarments = garments.filter((garment) => garment.disponible)

  return (
    <main className="app">
      <header className="app-header">
        <h1>Pressing M</h1>
        <p>Votre suivi de vêtements, en un coup d’œil.</p>
      </header>

      <section className="garment-grid" aria-label="Liste des vêtements">
        {garments.map((garment) => (
          <article className="garment-card" key={garment.id}>
            <img src={garment.image} alt={garment.nom} className="garment-image" />
            <h2>{garment.nom}</h2>
            <p className="price">{garment.prix} €</p>
            <ul className="status-list">
              <li>
                Lavage : <strong>{garment.lave ? 'Terminé' : 'En cours'}</strong>
              </li>
              <li>
                Paiement : <strong>{garment.paye ? 'Réglé' : 'À régler'}</strong>
              </li>
            </ul>
            <span className={`availability ${garment.disponible ? 'available' : 'unavailable'}`}>
              {garment.disponible ? 'Prêt à récupérer' : 'Indisponible'}
            </span>
          </article>
        ))}
      </section>

      <section className="available-list">
        <h2>Vêtements disponibles</h2>
        <ul>
          {availableGarments.map((garment) => (
            <li key={garment.id}>{garment.nom}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
