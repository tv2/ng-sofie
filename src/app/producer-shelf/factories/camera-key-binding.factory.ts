import { KeyBinding } from '../models/key-binding'
import { Injectable } from '@angular/core'

@Injectable()
export class CameraKeyBindingFactory {
    public createCameraKeyBindings(numberOfCameras: number): KeyBinding[] {
        return Array(numberOfCameras).fill(null).map((_, index) => {
            const cameraNumber: number = index + 1
            const label = `KAM ${cameraNumber}`
            return {
                key: cameraNumber.toString(),
                modifiers: [],
                label,
                action: () => console.error(label),
                onKeyPress: false,
            }
        })
    }
}
