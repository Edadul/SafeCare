import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Info,
  AlertTriangle,
  Baby,
  Shield,
  BookOpen,
  CheckCircle,
  XCircle,
  Heart,
} from "lucide-react"

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Info className="h-5 w-5" />
            <span className="text-sm font-medium">Informacion Educativa</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Disruptores Endocrinos y Pubertad Precoz
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Informacion cientifica sobre como los quimicos en productos de
            cuidado personal pueden afectar el desarrollo hormonal.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* What is Early Puberty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5 text-primary" />
                  Que es la Pubertad Precoz?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  La pubertad precoz ocurre cuando el cuerpo de un nino comienza
                  a cambiar a una forma adulta demasiado pronto. Se considera
                  pubertad precoz cuando ocurre:
                </p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span>
                      <strong>En ninas:</strong> antes de los 8 anos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span>
                      <strong>En ninos:</strong> antes de los 9 anos
                    </span>
                  </li>
                </ul>
                <p className="mt-4">
                  Los signos incluyen desarrollo mamario temprano, crecimiento
                  de vello pubico, acne, cambios de voz, y aceleracion del
                  crecimiento oseo.
                </p>
              </CardContent>
            </Card>

            {/* How Disruptors Work */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Como Funcionan los Disruptores Endocrinos?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Los disruptores endocrinos son quimicos que pueden interferir
                  con el sistema hormonal del cuerpo de varias maneras:
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      Imitacion Hormonal
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Algunos quimicos imitan hormonas naturales como el
                      estrogeno, enviando senales falsas al cuerpo.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      Bloqueo Hormonal
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Pueden bloquear las hormonas naturales, impidiendo que
                      cumplan su funcion normal.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      Alteracion de Produccion
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Interfieren con la produccion, liberacion o metabolismo de
                      hormonas naturales.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      Efecto Acumulativo
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Pequenas exposiciones diarias a multiples productos pueden
                      acumularse y causar efectos significativos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products to Watch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Productos de Mayor Riesgo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Perfumes y Fragancias
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Frecuentemente contienen ftalatos para fijar el aroma.
                        Buscar productos sin fragancia o con aceites esenciales.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Desodorantes con Aluminio
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        El aluminio puede interferir con las hormonas. Optar por
                        desodorantes naturales sin aluminio.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Protectores Solares Quimicos
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        La oxibenzona es un disruptor endocrino conocido.
                        Preferir protectores con oxido de zinc.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Cremas y Lociones con Parabenos
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Los parabenos imitan al estrogeno. Buscar productos
                        etiquetados "libre de parabenos".
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Recomendaciones para Protegerse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">
                        Lee las etiquetas:
                      </strong>{" "}
                      Aprende a identificar ingredientes peligrosos como
                      parabenos, ftalatos y oxibenzona.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">
                        Elige productos naturales:
                      </strong>{" "}
                      Prefiere productos con ingredientes organicos y
                      certificados.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">
                        Evita fragancias sinteticas:
                      </strong>{" "}
                      La palabra "fragrance" o "parfum" puede ocultar decenas de
                      quimicos no revelados.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">
                        Reduce la cantidad:
                      </strong>{" "}
                      Usar menos productos reduce la exposicion total a
                      quimicos.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">
                        Especial cuidado con ninos:
                      </strong>{" "}
                      Los ninos son mas vulnerables. Usa productos especialmente
                      formulados para ellos.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Datos Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-card">
                  <div className="text-3xl font-bold text-primary">80%</div>
                  <div className="text-sm text-muted-foreground">
                    de productos de cuidado personal contienen al menos un
                    disruptor endocrino
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-card">
                  <div className="text-3xl font-bold text-primary">10-16</div>
                  <div className="text-sm text-muted-foreground">
                    anos es la edad de mayor vulnerabilidad hormonal
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-card">
                  <div className="text-3xl font-bold text-primary">12+</div>
                  <div className="text-sm text-muted-foreground">
                    productos usa una persona promedio al dia
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-4 w-4" />
                  Fuentes Cientificas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-foreground">Endocrine Society</p>
                  <p className="text-muted-foreground">
                    Investigacion sobre disruptores endocrinos y salud
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">WHO/UNEP</p>
                  <p className="text-muted-foreground">
                    Estado de la ciencia de disruptores endocrinos
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">FDA</p>
                  <p className="text-muted-foreground">
                    Regulacion de ingredientes cosmeticos
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    Environmental Health Perspectives
                  </p>
                  <p className="text-muted-foreground">
                    Estudios sobre exposicion quimica y salud
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-2 border-red-200 bg-red-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Consulta Medica
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Si sospechas pubertad precoz en tu hijo/a, consulta con un
                      endocrinologo pediatrico. El diagnostico y tratamiento
                      tempranos son importantes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
