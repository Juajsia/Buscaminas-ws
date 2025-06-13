import { server } from './app.js'
import './io.js'

try {
  const PORT = process.env.PORT || 3000

  server.listen(PORT, () => {
    console.log('app running in port 3000')
  })
} catch (error) {
  console.error('Error initalizating server', error)
}