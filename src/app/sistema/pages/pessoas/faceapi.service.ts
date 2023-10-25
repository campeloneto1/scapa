import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';
import { LabeledFaceDescriptors } from 'face-api.js';

@Injectable({
  providedIn: 'root',
})
export class FaceapiService {

  async loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models');
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');

  }

  async recognizeFace(image: HTMLImageElement) {
    await this.loadModels();
    const detections = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    return detections;
  }


  async recognizeFaces(image: HTMLImageElement) {
    await this.loadModels();
    const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
    return detections;
  }
  
  async facematcher(image: LabeledFaceDescriptors){
    const matcher = new faceapi.FaceMatcher(image);
    return matcher;
  }

  async fromJson(data: Object){
    const matcher = faceapi.FaceMatcher.fromJSON(data);
    return matcher;
  }
}