module Main exposing (main)

import Browser
import Type
import View.App
import State

main : Program () Type.T_model Type.T_msg
main =
    Browser.element
        { init = State.init
        , update = State.update
        , view = View.App.app_view
        , subscriptions = (\_ -> Sub.none)
        }
