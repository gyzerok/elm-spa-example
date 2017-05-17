module Main exposing (main)

import Navigation exposing (Location)
import Route
import App
import Json.Decode exposing (Value)


main : Program Value App.Model App.Msg
main =
    Navigation.programWithFlags (Route.fromLocation >> App.SetRoute)
        { init = App.init
        , view = App.view
        , update = App.update
        , subscriptions = App.subscriptions
        }
