import { Injectable } from '@angular/core'
import { KeyBinding } from '../../keyboard/models/key-binding'

@Injectable()
export class CameraKeyBindingFactory {
    public createCameraKeyBindings(numberOfCameras: number): KeyBinding[] {
        return Array(numberOfCameras).fill(null).map((_, index) => {
            const cameraNumber: number = index + 1
            const label = `KAM ${cameraNumber}`
            return {
                keys: [`Digit${cameraNumber}`],
                label,
                onMatched: () => console.error(label),
                shouldMatchOnKeyRelease: true,
                shouldPreventDefaultBehaviourOnKeyPress: true,
                shouldPreventDefaultBehaviourForPartialMatches: true,
                useExclusiveMatching: true,
                useOrderedMatching: false,
            }
        })
    }
}
