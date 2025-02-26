"use client"

import { FC, useEffect, useRef } from "react";
import * as THREE from "three"
import gsap from 'gsap'
import { Effect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

import vertex from "@/components/shaders/vertex.glsl"
import gradientFrag from "@/components/shaders/gradient.glsl"
import { CurveEffect } from "@/components/shaders/curve";
import { ChromaEffect } from "@/components/shaders/chroma";
import { NoiseEffect } from "@/components/shaders/noise";
import { TurbulenceEffect } from "@/components/shaders/turbulence";

interface DonezoGradientProps {
    width?: number
    height?: number
    className?: string
    colorA?: THREE.Color
    colorB?: THREE.Color
    colorC?: THREE.Color
    colorD?: THREE.Color
}

function initializeCanvas(canvas: HTMLCanvasElement, colorA?: THREE.Color, colorB?: THREE.Color, colorC?: THREE.Color, colorD?: THREE.Color,) {
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: true,
    })

    const quadGeometry = new THREE.PlaneGeometry(2, 2);
    const quadMaterial = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: gradientFrag,
        depthWrite: false
    })
    const quadMesh = new THREE.Mesh(quadGeometry, quadMaterial)
    quadMesh.rotateY(Math.PI / 2)
    scene.add(quadMesh)

    const composer = new EffectComposer(renderer, {
        frameBufferType: THREE.FloatType
    })
    composer.setSize(canvas.width, canvas.height)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const turbulence = new TurbulenceEffect()
    const turbulencePass = new EffectPass(camera, turbulence)
    composer.addPass(turbulencePass)

    const curveEffect = new CurveEffect({
        controls: new THREE.Vector3(1, 0.6, 0)
    })
    const chromaEffect = new ChromaEffect({
        colorA: colorA,
        colorB: colorB,
        colorC: colorC,
        colorD: colorD
    })
    const preNoise = new NoiseEffect()
    const effectPass = new EffectPass(camera,
        preNoise,
        curveEffect,
        chromaEffect
    )
    effectPass.renderToScreen = true
    composer.addPass(effectPass)

    registerMouseMoveListener(canvas, turbulence)
    registerCanvasResizeListener({ canvas, renderer, composer })

    let handle: number;
    function render() {
        handle = requestAnimationFrame(render)
        composer.render()
    }

    render()

    return () => {
        cancelAnimationFrame(handle)
    }
}

function registerCanvasResizeListener(obj: {
    canvas: HTMLCanvasElement,
    renderer: THREE.WebGLRenderer,
    composer: EffectComposer,
}) {
    const canvasResizeListener = () => {
        const {
            canvas,
            renderer,
            composer,
        } = obj

        canvas.style.width = ""
        canvas.style.height = ""
        const { width, height } = canvas.getBoundingClientRect()
        const size = Math.max(width, height);
        canvas.width = size
        canvas.height = size

        renderer.setSize(size, size)
        composer.setSize(size, size)
    }
    canvasResizeListener()

    window.addEventListener("resize", canvasResizeListener)

    let pxRatio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;

    function isZooming() {
        const newPxRatio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
        if (newPxRatio != pxRatio) {
            pxRatio = newPxRatio;
            return true
        }
        return false
    }

    let handle: number;

    function rafZoom() {
        if (isZooming()) {
            canvasResizeListener()
        }
        handle = requestAnimationFrame(rafZoom)
    }

    rafZoom()

    return () => {
        window.removeEventListener("resize", canvasResizeListener)
        cancelAnimationFrame(handle)
    }
}

function registerMouseMoveListener(canvas: HTMLCanvasElement, turbulenceEffect: Effect) {
    const listener = (e: MouseEvent) => {
        const amount = turbulenceEffect.uniforms.get("amount")!
        const evolution = turbulenceEffect.uniforms.get("evolution")!
        const rect = canvas.getBoundingClientRect()

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const u = mouseX / rect.width
        const v = mouseY / rect.height

        gsap.to(amount, {
            value: u * 8 + 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: true
        })

        gsap.to(evolution, {
            value: v * 3,
            duration: 0.5,
            ease: "power2.out",
            overwrite: true
        })
    }

    document.addEventListener("mousemove", listener)

    return () => document.removeEventListener("mousemove", listener)
}

const DonezoGradient: FC<DonezoGradientProps> = ({ width, height, className, colorA, colorB, colorC, colorD }) => {

    const canvas = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvas.current) return

        const { width: tw, height: th } = canvas.current.getBoundingClientRect()
        canvas.current.width = width ?? tw
        canvas.current.height = height ?? th

        return initializeCanvas(canvas.current, colorA, colorB, colorC, colorD)
    }, [canvas]);

    return (
        <div className={className}>
            <canvas ref={canvas} className={"aspect-square object-cover w-full h-full"}/>
        </div>
    )
}

export default DonezoGradient