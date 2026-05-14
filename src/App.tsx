import './App.css'

type Garment = {
  id: number
  nom: string
  lave: boolean
  paye: boolean
  prix: number
  disponible: boolean
}

const garments: Garment[] = [
  { id: 1, nom: 'Chemise blanche', lave: true, paye: true, prix: 8, disponible: true },
  { id: 2, nom: 'Pantalon noir', lave: false, paye: false, prix: 10, disponible: false },
  { id: 3, nom: 'Robe rouge', lave: true, paye: false, prix: 12, disponible: true },
  { id: 4, nom: 'Veste en laine', lave: false, paye: true, prix: 15, disponible: false },
]

function App() {
  const availableGarments = garments.filter((garment) => garment.disponible)

  return (
    <main className="app">
      <h1>Gestion de pressing</h1>
      <p>État des vêtements : lavage, paiement, prix et disponibilité.</p>

      <table>
        <thead>
          <tr>
            <th>Vêtement</th>
            <th>Lavé</th>
            <th>Payé</th>
            <th>Prix</th>
            <th>Disponible</th>
          </tr>
        </thead>
        <tbody>
          {garments.map((garment) => (
            <tr key={garment.id}>
              <td>{garment.nom}</td>
              <td>{garment.lave ? 'Oui' : 'Non'}</td>
              <td>{garment.paye ? 'Oui' : 'Non'}</td>
              <td>{garment.prix} €</td>
              <td>{garment.disponible ? 'Oui' : 'Non'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section>
        <h2>Liste de vêtements disponibles</h2>
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
