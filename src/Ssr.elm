port module Ssr exposing (programWithFlags, program)

import ElmHtml.InternalTypes exposing (decodeElmHtml)
import ElmHtml.ToString exposing (nodeToString)
import Json.Decode as Decode
import Native.Jsonify
import Html
import Platform


port htmlOut : String -> Cmd msg


programWithFlags :
    { init : flags -> ( model, Cmd msg )
    , update : msg -> model -> ( model, Cmd msg )
    , view : model -> Html.Html msg
    }
    -> Program flags model msg
programWithFlags { init, update, view } =
    Platform.programWithFlags
        { init = enhanceInit init view
        , update = enhanceUpdate update view
        , subscriptions = (always Sub.none)
        }


program :
    { init : ( model, Cmd msg )
    , update : msg -> model -> ( model, Cmd msg )
    , view : model -> Html.Html msg
    }
    -> Program Never model msg
program { init, update, view } =
    programWithFlags
        { init = \_ -> init
        , update = update
        , view = view
        }


enhanceInit : (flags -> ( model, Cmd msg )) -> (model -> Html.Html msg) -> flags -> ( model, Cmd msg )
enhanceInit initFn viewFn flags =
    let
        ( model, cmds ) =
            initFn flags
    in
        if cmds == Cmd.none then
            ( model, htmlOut (htmlToString (viewFn model)) )
        else
            ( model, cmds )


enhanceUpdate :
    (msg -> model -> ( model, Cmd msg ))
    -> (model -> Html.Html msg)
    -> msg
    -> model
    -> ( model, Cmd msg )
enhanceUpdate updateFn viewFn msg model =
    let
        ( nextModel, cmds ) =
            updateFn msg model
    in
        if cmds == Cmd.none then
            ( model, htmlOut (htmlToString (viewFn nextModel)) )
        else
            ( nextModel, cmds )



---- HELPERS ----


toJson : Html.Html msg -> Decode.Value
toJson =
    Native.Jsonify.toJson


htmlToString : Html.Html msg -> String
htmlToString html =
    case Decode.decodeValue (decodeElmHtml (\_ _ -> Decode.value)) (toJson html) of
        Err str ->
            str

        Ok vdom ->
            nodeToString vdom
