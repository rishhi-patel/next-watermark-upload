import type { NextPage } from "next"
import React from "react"
import Watermark from "watermark-image"
import "./styles.css"
interface WatermarkModuleStatus {
  text: string
  hex: string
  fontSize: number
  watermarkHeight: number
  watermarkWidth: number
  rgb: any
}

const Home: NextPage<WatermarkModuleStatus> = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const inputFileRef = React.useRef<HTMLInputElement | null>(null)
  const [image, setImage] = React.useState(null)
  const [mainCanvas, setMainCanvas] = React.useState<HTMLCanvasElement>()

  const handleOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    /* Prevent form from submitting by default */
    e.preventDefault()

    /* If file is not selected, then show alert message */
    if (!inputFileRef.current?.files?.length) {
      alert("Please, select file you want to upload")
      return
    }

    setIsLoading(true)

    /* Add files to FormData */
    const formData = new FormData()
    Object.values(inputFileRef.current.files).forEach((file) => {
      const url: any = URL.createObjectURL(file)
      const watermark = new Watermark(mainCanvas as HTMLCanvasElement)
      let w: number = 0
      let h: number = 0
      const img = document.createElement("img")
      img.src = url
      img.onload = function () {
        w = img.width
        h = img.height
        console.log({ w, h })

        if (w > 512 || h > 512) {
          alert("Please, upload image with resolution 512 x 512")
          setIsLoading(false)
          return
        }
        setImage(url)
        watermark.draw(url, {
          text: "This is a Watermark",
          fontSize: 23,
          fillStyle: "rgb(255,255,255 ,1)",
          watermarkHeight: 180,
          watermarkWidth: 280,
        })

        formData.append("file", file)
        setIsLoading(false)
      }
    })
  }

  return (
    <>
      <form
        className="form-container"
        style={image ? { height: "fit-content" } : { height: "100vh" }}
      >
        <div className="canvas-parent">
          <div className="upload-files-container">
            <div>
              <input
                type="file"
                name="myfile"
                ref={inputFileRef}
                className="drag-file-area"
              />
            </div>
            <div>
              <input
                type="submit"
                value="Generate"
                disabled={isLoading}
                onClick={handleOnClick}
                className="upload-button"
              />
              {isLoading && ` Wait, please...`}
            </div>
          </div>
          <div
            className={`upload-canvas-container`}
            style={image ? { display: "flex" } : { display: "none" }}
          >
            <h3 className="dynamic-message">
              your watermarked image will showup here{" "}
            </h3>
            <canvas
              id="canvas"
              style={{ width: 512, height: "88%" }}
              ref={(canvas: HTMLCanvasElement) => setMainCanvas(canvas)}
            />
          </div>
        </div>
      </form>
      <div className="form-container"></div>
    </>
  )
}

export default Home
