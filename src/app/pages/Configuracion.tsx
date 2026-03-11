import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export function Configuracion() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Configuración</h2>
        <p className="text-muted-foreground">Personaliza tu experiencia</p>
      </div>

      {/* Apariencia */}
      <Card>
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tema</p>
              <p className="text-sm text-muted-foreground">
                Selecciona el modo de color de la aplicación
              </p>
            </div>
            <Button onClick={toggleTheme} variant="outline">
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Modo Oscuro
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Modo Claro
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Nombre" defaultValue="Usuario" />
          <Input label="Email" type="email" defaultValue="usuario@example.com" />
          <Button>Guardar Cambios</Button>
        </CardContent>
      </Card>

      {/* Moneda */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de Moneda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Moneda Base</p>
              <p className="text-sm text-muted-foreground">
                Actualmente: USD (Dólar Estadounidense)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API */}
      <Card>
        <CardHeader>
          <CardTitle>Conexión API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            label="URL de la API" 
            placeholder="https://api.tuservidor.com" 
            type="url"
          />
          <Input 
            label="API Key" 
            placeholder="Tu clave de API" 
            type="password"
          />
          <p className="text-sm text-muted-foreground">
            Configura la conexión con tu backend para sincronizar los datos en tiempo real.
          </p>
          <Button>Probar Conexión</Button>
        </CardContent>
      </Card>
    </div>
  );
}
