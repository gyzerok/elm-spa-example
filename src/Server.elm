module Server exposing (main)

import Navigation exposing (Location)
import App
import Json.Decode as Decode
import Ssr


main : Program { session : Decode.Value, location : Location } App.Model App.Msg
main =
    Ssr.programWithFlags
        { init = \flags -> App.init flags.session flags.location
        , update = App.update
        , view = App.view
        }
