
import {v2 as cloudinary} from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "path";
cloudinary.config({
    cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})

export async  function POST(request: NextRequest){
try {
    const formData = await  request.formData()
    const file = formData.get("file") as File


    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

        // Convert file to buffer

        const bytes = await file.arrayBuffer()
        const buffer =  Buffer.from(bytes)

        // Upload to Cloudinary 


        const result = await new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "real-estate",
          transformation: [
            { width: 800, height: 600, crop: "fill", quality: "auto" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
      return NextResponse.json({url:(result as any).secure_url })
} catch (error) {
    console.error("Upload error:", error)
     return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
}

}