"use strict";
/**
 * Image manipulation functions
 */
const sharp = require("sharp");

const { bytesToKbytes } = require("strapi-plugin-upload/utils/file");

const getMetadatas = buffer =>
  sharp(buffer)
    .metadata()
    .catch(() => ({})); // ignore errors

const getDimensions = buffer =>
  getMetadatas(buffer)
    .then(({ width = null, height = null }) => ({ width, height }))
    .catch(() => ({})); // ignore errors

const THUMBNAIL_RESIZE_OPTIONS = {
  width: 245,
  height: 156,
  fit: "inside"
};

// Gets the format name after the dot "."
const getFormat = (ext) => ext.substring(1);

const resizeTo = (buffer, options, format) =>
  sharp(buffer)
    .resize(options)
    .toFormat(format)
    .toBuffer()
    .catch(() => null);

const reFormat = (format) => (format === "jpeg" ? "jpg" : format);
// Renames the file extension.
const reName = (name, toName) =>
  name.split(".").slice(0, -1).join().concat(toName);

const generateThumbnail = async file => {
  if (!(await canBeProccessed(file.buffer))) {
    return null;
  }

  const { width, height } = await getDimensions(file.buffer);

  if (
    width > THUMBNAIL_RESIZE_OPTIONS.width ||
    height > THUMBNAIL_RESIZE_OPTIONS.height
  ) {
    const newBuff = await resizeTo(
      file.buffer,
      THUMBNAIL_RESIZE_OPTIONS,
      getFormat(file.ext)
    );

    if (newBuff) {
      const { width, height, size } = await getMetadatas(newBuff);

      return {
        name: `thumbnail_${file.name}`,
        hash: `thumbnail_${file.hash}`,
        ext: file.ext,
        mime: file.mime,
        width,
        height,
        size: bytesToKbytes(size),
        buffer: newBuff,
        path: file.path ? file.path : null
      };
    }
  }

  return null;
};

const optimize = async buffer => {
  const {
    sizeOptimization = false,
    autoOrientation = false
  } = await strapi.plugins.upload.services.upload.getSettings();

  if (!sizeOptimization || !(await canBeProccessed(buffer))) {
    return { buffer };
  }

  const sharpInstance = autoOrientation
    ? sharp(buffer).rotate()
    : sharp(buffer);
  return sharpInstance
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => ({
      buffer: data,
      info: {
        width: info.width,
        height: info.height,
        size: bytesToKbytes(info.size)
      }
    }))
    .catch(() => ({ buffer }));
};

const BREAKPOINTS = [
  ["large", 1000],
  ["medium", 750],
  ["small", 500],
];

const generateResponsiveFormats = async file => {
  const {
    responsiveDimensions = false
  } = await strapi.plugins.upload.services.upload.getSettings();

  if (!responsiveDimensions) return [];
  if (!(await canBeProccessed(file.buffer))) return [];


  if (!(await canBeProccessed(file.buffer))) {
    return [];
  }

  const originalDimensions = await getDimensions(file.buffer);
  const format = getFormat(file.ext);
  const toFormats = [format];

  // We need to check the original image format to prevent duplication.
  if (format !== "webp") {
    toFormats.push("webp");
  }
  return await Promise.all(
    toFormats.map((toFormat) => {
      // For each format,
      return Promise.all(
        BREAKPOINTS.map(([key, breakpoint]) => {
          if (breakpointSmallerThan(breakpoint, originalDimensions)) {
            // Generate breakpoint sized image
            return generateBreakpoint(key, {
              file,
              toFormat,
              breakpoint,
              originalDimensions,
            });
          }
        })
      );
    })
  );
};

const generateBreakpoint = async (key, { file, toFormat, breakpoint }) => {
  const newBuff = await resizeTo(
    file.buffer,
    {
      width: breakpoint,
      height: breakpoint,
      fit: "inside"
    },
    toFormat
  );

  if (newBuff) {
    const data = await getMetadatas(newBuff);
    const { width, height, size } = data;
    const format = reFormat(data.format);
    const ext = `.${format}`;

    return {
      key,
      file: {
        name: `${key}_${reName(file.name, ext)}`,
        hash: `${key}_${file.hash}`,
        ext,
        mime: `image/${format}`,
        width,
        height,
        size: bytesToKbytes(size),
        buffer: newBuff,
        path: file.path ? file.path : null
      }
    };
  }
};

const breakpointSmallerThan = (breakpoint, { width, height }) => {
  return breakpoint < width || breakpoint < height;
};

const formatsToProccess = ["jpeg", "png", "webp", "tiff"];
const canBeProccessed = async buffer => {
  const { format } = await getMetadatas(buffer);
  return format && formatsToProccess.includes(format);
};

const BASE64_RESIZE_OPTIONS = {
  width: 20,
  height: 20,
  fit: "inside"
};

const generateBase64 = async file => {
  const newBuff = await sharp(file.buffer)
    .resize(BASE64_RESIZE_OPTIONS)
    .toBuffer({
      resolveWithObject: true
    });
  if (newBuff) {
    const { data, info } = newBuff;
    return {
      url: `data:image/${info.format};base64,${data.toString("base64")}`,
      width: info.width,
      height: info.height
    };
  }
};

module.exports = {
  getDimensions,
  generateResponsiveFormats,
  generateThumbnail,
  bytesToKbytes,
  optimize,
  generateBase64
};
