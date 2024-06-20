import { TransformedData } from "@/interface/TransformedData";
import { getLink } from "../../../shared/utils/getLink";
import { getDescription } from "../../../shared/utils/getDescription";
import { getPumpAVR } from "../../../shared/utils/getPumpAVR";

export const parseXml = (xmlText: string): TransformedData[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  const parsedElements: TransformedData[] = [];
  let count = 1;
  const xmlChildren = xmlDoc.getElementsByTagName("children")[0].childNodes;
  Array.from(xmlChildren).forEach((childNode) => {
    const el = childNode as Element;
    if (el.nodeName === "Rectangle") {
      parsedElements.push({
        id: count++,
        type: "Rectangle",
        x: parseFloat(el.getAttribute("layoutX") || "0"),
        y: parseFloat(el.getAttribute("layoutY") || "0"),
        fill: el.getAttribute("fill") || "silver",
        height: parseFloat(el.getAttribute("height") || "0"),
        width: parseFloat(el.getAttribute("width") || "0"),
        stroke: el.getAttribute("stroke") || "black",
        rotate: parseFloat(el.getAttribute("rotate") || "0"),
        strokeWidth: parseFloat(el.getAttribute("strokeWidth") || "2"),
        dash: el.getAttribute("styleClass") || "",
      });
    } else if (el.nodeName === "Polygon") {
      const points = el.getAttribute("points")?.split(", ").map(Number);
      parsedElements.push({
        id: count++,
        type: "PolygonShape",
        x: parseFloat(el.getAttribute("layoutX") || "0"),
        y: parseFloat(el.getAttribute("layoutY") || "0"),
        points: points || [],
        fill: el.getAttribute("fill") || "silver",
        stroke: el.getAttribute("stroke") || "black",
      });
    } else if (el.nodeName === "FunctionControl") {
      let type: string;
      const skinType = el.getAttribute("skinType");

      if (skinType === "ARROW") {
        type = "LineArrow";
      } else if (skinType === "FILTER") {
        type = "AirFilters";
      } else if (skinType === "LEVEL") {
        type = "ProgressBar";
      }
      const kks = el.getAttribute("kks") || "";
      const layoutX = parseFloat(el.getAttribute("layoutX") || "0");
      const layoutY = parseFloat(el.getAttribute("layoutY") || "0");
      const rotate = el.getAttribute("orientation") || "HORIZONTAL";
      const fill = el.getAttribute("fill") || "black";

      const height = parseFloat(el.getAttribute("prefHeight") || "");
      const width = parseFloat(el.getAttribute("prefWidth") || "");
      const opacity = parseFloat(el.getAttribute("opacity") || "1");
      const maxValue = parseFloat(el.getAttribute("maxValue") || "1");
      const minValue = parseFloat(el.getAttribute("minValue") || "");

      const colorNode = el.getElementsByTagName("Color")[0];
      if (colorNode) {
        const red = Number(colorNode.getAttribute("red") || 0);
        const green = Number(colorNode.getAttribute("green") || 0);
        const blue = Number(colorNode.getAttribute("blue") || 0);

        parsedElements.push({
          id: count++,
          type: type!,
          x: layoutX,
          y: layoutY,
          rotate: rotate,
          fill: fill,
          height: height,
          width: width,
          red: red,
          green: green,
          blue: blue,
        });
      } else {
        parsedElements.push({
          id: count++,
          type: type!,
          x: layoutX,
          y: layoutY,
          rotate: rotate,
          kks: kks,
          height: height,
          width: width,
          opacity: opacity,
          maxValue: maxValue,
          minValue: minValue,
        });
      }
    } else if (el.nodeName === "Line") {
      const layoutX = parseFloat(el.getAttribute("layoutX") || "0");
      const layoutY = parseFloat(el.getAttribute("layoutY") || "0");
      const startX = parseFloat(el.getAttribute("startX") || "0");
      const startY = parseFloat(el.getAttribute("startY") || "0");
      const endX = parseFloat(el.getAttribute("endX") || "0");
      const endY = parseFloat(el.getAttribute("endY") || "0");
      const rotate = parseFloat(el.getAttribute("rotate") || "0");
      const stroke = el.getAttribute("stroke") || "black";
      const strokeWidth = parseFloat(el.getAttribute("strokeWidth") || "1");
      const dash = el.getAttribute("styleClass") || "";

      parsedElements.push({
        id: count++,
        type: "LineMain",
        x1: layoutX + startX,
        y1: layoutY + startY,
        x2: layoutX + endX,
        y2: layoutY + endY,
        rotate: rotate,
        color: stroke,
        strokeWidth: strokeWidth,
        dash: dash,
      });
    } else if (el.nodeName === "Circle") {
      const layoutX = parseFloat(el.getAttribute("layoutX") || "0");
      const layoutY = parseFloat(el.getAttribute("layoutY") || "0");
      const radius = parseFloat(el.getAttribute("radius") || "0");
      const fill = el.getAttribute("fill") || "silver";
      const stroke = el.getAttribute("stroke") || "black";
      const strokeWidth = parseFloat(el.getAttribute("strokeWidth") || "1");
      const scaleX = parseFloat(el.getAttribute("scaleX") || "1");
      const scaleY = parseFloat(el.getAttribute("scaleY") || "1");

      parsedElements.push({
        id: count++,
        type: "Point",
        x: layoutX,
        y: layoutY,
        radius: radius,
        fill: fill,
        stroke: stroke,
        strokeWidth: strokeWidth,
        scaleX: scaleX,
        scaleY: scaleY,
      });
    } else if (el.nodeName === "Arc") {
      const layoutX = parseFloat(el.getAttribute("layoutX") || "0");
      const layoutY = parseFloat(el.getAttribute("layoutY") || "0");
      const fill = el.getAttribute("fill") || "silver";
      const stroke = el.getAttribute("stroke") || "black";
      const length = parseFloat(el.getAttribute("length") || "0");
      const radiusX = parseFloat(el.getAttribute("radiusX") || "0");
      const radiusY = parseFloat(el.getAttribute("radiusY") || "0");
      const startAngle = parseFloat(el.getAttribute("startAngle") || "0");
      const strokeWidth = parseFloat(el.getAttribute("strokeWidth") || "1");
      const strokeType = el.getAttribute("strokeType") || "";

      parsedElements.push({
        id: count++,
        type: "ArcShape",
        x: layoutX,
        y: layoutY,
        fill: fill,
        stroke: stroke,
        length,
        radiusX: radiusX,
        radiusY: radiusY,
        startAngle,
        strokeWidth: strokeWidth,
        strokeType: strokeType,
      });
    } else if (el.nodeName === "PumpControl") {
      const equipmentType = el.getAttribute("equipmentType") || "PMP";

      if (equipmentType === "PMP") {
        const layoutX = parseFloat(el.getAttribute("layoutX") || "0");
        const layoutY = parseFloat(el.getAttribute("layoutY") || "0");
        const kks = el.getAttribute("kks") || "";
        const prefHeight = Math.max(20, Number(el.getAttribute("prefHeight") || "0"));
        const prefWidth = Math.max(20, Number(el.getAttribute("prefWidth") || "0"));
        const rotate = el.getAttribute("orientation") || "HORIZONTAL";
        const sys = el.getAttribute("system") || "";
        const description = getDescription((el.getAttribute("kks") || "").toLowerCase());
        const withAVR = getPumpAVR((el.getAttribute("kks") || "").toUpperCase());

        parsedElements.push({
          id: count++,
          type: "PumpControl",
          x: layoutX,
          y: layoutY,
          kks: kks,
          prefHeight: prefHeight,
          prefWidth: prefWidth,
          rotate: rotate,
          sys,
          description,
          withAVR,
        });
      } else if (equipmentType === "PMK") {
        const layoutX = parseFloat(el.getAttribute("layoutX") || "0");
        const layoutY = parseFloat(el.getAttribute("layoutY") || "0");
        const kks = el.getAttribute("kks") || "";
        const prefHeight = Math.max(20, Number(el.getAttribute("prefHeight") || "0"));
        const prefWidth = Math.max(20, Number(el.getAttribute("prefWidth") || "0"));
        const rotate = el.getAttribute("orientation") || "HORIZONTAL";
        const sys = el.getAttribute("system") || "";
        const description = getDescription((el.getAttribute("kks") || "").toLowerCase());

        parsedElements.push({
          id: count++,
          type: "PumpControlPMK",
          x: layoutX,
          y: layoutY,
          kks: kks,
          prefHeight: prefHeight,
          prefWidth: prefWidth,
          rotate: rotate,
          sys,
          description,
        });
      }
    } else if (el.nodeName === "DetectorControl") {
      const layoutX = parseFloat(el.getAttribute("layoutX") || "0");
      const layoutY = parseFloat(el.getAttribute("layoutY") || "0");
      const kks = el.getAttribute("kks") || "";
      const param = el.getAttribute("param") || "";
      const sys = el.getAttribute("system") || "";
      const unit =
        el.getAttribute("param") !== "T" && el.getAttribute("param") !== "Tм" && el.getAttribute("param") !== "ΔT"
          ? el.getAttribute("unit")
          : "°C";
      const tooltipTextElement = el.getElementsByTagName("tooltip")[0]?.getElementsByTagName("Tooltip")[0];
      const tooltipText = tooltipTextElement ? tooltipTextElement.getAttribute("text") : "";
      const decimals = parseFloat(el.getAttribute("decimals") || "2");
      const maxValue = parseFloat(el.getAttribute("maxValue") || "0");
      const minValue = parseFloat(el.getAttribute("minValue") || "0");

      const height = parseFloat(el.getAttribute("prefHeight") || "0");

      parsedElements.push({
        id: count++,
        type: "DetectorControl",
        x: layoutX,
        y: layoutY,
        kks: kks,
        param,
        unit: unit,
        tooltipText: tooltipText || "",
        sys,
        decimals,
        maxValue,
        height,
        minValue,
      });
    } else if (el.nodeName === "Text") {
      const x = parseFloat(el.getAttribute("layoutX") || "0");
      const y = parseFloat(el.getAttribute("layoutY") || "0");
      const text = el.getAttribute("text") || "";
      const fill = el.getAttribute("fill") || "black";
      const rotate = parseFloat(el.getAttribute("rotate") || "0");
      const wrappingWidth = parseFloat(el.getAttribute("wrappingWidth") || "0");
      const textAlignment = (el.getAttribute("textAlignment") || "CENTER").toLowerCase();
      const fontData = el.querySelector("Font")?.getAttribute("name") || "Tahoma";
      const [fontName, fontStyle] = fontData.includes("Bold") ? ["Tahoma", "bold"] : ["Tahoma", "normal"];
      const size = parseFloat(el.querySelector("Font")?.getAttribute("size") || "12");

      parsedElements.push({
        id: count++,
        type: "TextMain",
        x,
        y,
        text,
        fontName,
        fontStyle,
        size,
        fill,
        rotate,
        wrappingWidth,
        textAlignment,
      });
    } else if (el.nodeName === "IndicationControl") {
      const skinType = el.getAttribute("skinType") || "";

      if (skinType === "LAMP") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const kks = el.getAttribute("kks") || "";

        const secondStatusColorEl = el?.getElementsByTagName("secondStatusColor")[0];
        const secondStatusColor = secondStatusColorEl?.getElementsByTagName("Color")[0];
        const red = parseFloat(secondStatusColor?.getAttribute("red") || "0");
        const green = parseFloat(secondStatusColor?.getAttribute("green") || "0");
        const blue = parseFloat(secondStatusColor?.getAttribute("blue") || "0");

        parsedElements.push({
          id: count++,
          type: "Lamp",
          x,
          y,
          height,
          width,
          kks,
          red,
          green,
          blue,
        });
      } else if (skinType === "TABLO") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const firstStatus = el.getAttribute("firstStatus") || "";
        const secondStatus = el.getAttribute("secondStatus") || "";
        const thirdStatus = el.getAttribute("thirdStatus") || "";

        const textAlignment = el.getAttribute("textAlignment")?.toLocaleLowerCase() || "center";

        const kks = el.getAttribute("kks") || "";
        const sys = el.getAttribute("system") || "all";

        const firstStatusColorEl = el?.getElementsByTagName("firstStatusColor")[0];
        const firstStatusColor = firstStatusColorEl?.getElementsByTagName("Color")[0];
        const red = parseFloat(firstStatusColor?.getAttribute("red") || "0");
        const green = parseFloat(firstStatusColor?.getAttribute("green") || "0");
        const blue = parseFloat(firstStatusColor?.getAttribute("blue") || "0");

        const secondStatusColorEl = el?.getElementsByTagName("secondStatusColor")[0];
        const secondStatusColor = secondStatusColorEl?.getElementsByTagName("Color")[0];
        const red2 = parseFloat(secondStatusColor?.getAttribute("red") || "0");
        const green2 = parseFloat(secondStatusColor?.getAttribute("green") || "0");
        const blue2 = parseFloat(secondStatusColor?.getAttribute("blue") || "0");

        const thirdStatusColorEl = el?.getElementsByTagName("thirdStatusColor")[0];
        const thirdStatusColor = thirdStatusColorEl?.getElementsByTagName("Color")[0];
        const red3 = parseFloat(thirdStatusColor?.getAttribute("red") || "0");
        const green3 = parseFloat(thirdStatusColor?.getAttribute("green") || "0");
        const blue3 = parseFloat(thirdStatusColor?.getAttribute("blue") || "0");

        const customFontEl = el?.getElementsByTagName("customFont")[0];
        const customFont = customFontEl?.getElementsByTagName("Font")[0];
        const fontSize = parseFloat(customFont?.getAttribute("size") || "12");
        const fontNameAndWeight = customFont?.getAttribute("name") || "Tahoma";
        const fontNameParts = fontNameAndWeight.split(" ");
        const fontName = fontNameParts[0];
        const fontWeight = fontNameParts.includes("Bold") ? "bold" : "normal";

        parsedElements.push({
          id: count++,
          type: "Tablo",
          x,
          y,
          height,
          width,
          firstStatus,
          secondStatus,
          thirdStatus,
          textAlignment,
          kks,
          sys,
          red,
          green,
          blue,
          red2,
          green2,
          blue2,
          red3,
          green3,
          blue3,
          fontSize,
          fontName,
          fontWeight,
        });
      }
    } else if (el.nodeName === "ValveControl") {
      let type: string;
      const skinType = el.getAttribute("skinType");
      const equipmentType = el.getAttribute("equipmentType");

      if (skinType === "ELECTRIC_VLV") {
        type = "ElectricGateValve";
      } else if (skinType === "CTRL_VLV") {
        type = "Regulator";
      } else if (skinType === "HANDLE_VLV") {
        type = "HandFittings";
      } else if (skinType === "SAFETY_VLV_V2") {
        type = "SafetyValve";
      } else if (skinType === "SAFETY_VLV") {
        type = "SafetyShutOffValve";
      } else if (skinType === "CHECK_VLV") {
        type = "ReverseValve";
      } else if (skinType === "RELIEF_VLV") {
        type = "BackSafetyValve";
      } else if (equipmentType === "TWVLV") {
        type = "TwvlvValve";
      } else if (equipmentType === "TWCNT") {
        type = "TwcntValve";
      } else if (equipmentType === "TWHCNT") {
        type = "TwhcntValve";
      }

      const x = parseFloat(el.getAttribute("layoutX") || "0");
      const y = parseFloat(el.getAttribute("layoutY") || "0");
      const rotate = el.getAttribute("orientation") || "0";
      const kks = el.getAttribute("kks") || "";

      const description = getDescription((el.getAttribute("kks") || "").toLowerCase());
      const scaleY = parseFloat(el.getAttribute("scaleY") || "0");
      const prefHeight = Math.max(20, Number(el?.getAttribute("prefHeight") || "0"));
      const prefWidth = Math.max(20, Number(el?.getAttribute("prefWidth") || "0"));
      const sys = el?.getAttribute("system") || "all";

      parsedElements.push({
        id: String(count++),
        type: type!,
        x,
        kks,
        y,
        rotate,
        prefHeight,
        prefWidth,
        sys,
        scaleY,
        description,
      });
    } else if (el.nodeName === "Ellipse") {
      const x = parseFloat(el.getAttribute("layoutX") || "0");
      const y = parseFloat(el.getAttribute("layoutY") || "0");
      const rotate = parseFloat(el.getAttribute("rotate") || "0");
      const radiusX = parseFloat(el.getAttribute("radiusX") || "0");
      const radiusY = parseFloat(el.getAttribute("radiusY") || "0");
      const fill = el.getAttribute("fill") || "black";
      const stroke = el.getAttribute("stroke") || "black";
      const strokeWidth = parseFloat(el.getAttribute("strokeWidth") || "2");

      parsedElements.push({
        id: count++,
        type: "EllipseShape",
        x,
        y,
        rotate,
        radiusX,
        radiusY,
        fill,
        stroke,
        strokeWidth,
      });
    } else if (el.nodeName === "ButtonControl") {
      const equipmentType = el.getAttribute("equipmentType") || "";

      if (equipmentType === "TRANSITION_BUTTON") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const buttonOnText = el.getAttribute("buttonOnText") || "";
        const buttonOffText = el.getAttribute("buttonOffText") || "";
        const opacityMain = parseFloat(el.getAttribute("opacity") || "1");
        const textAlignment = el.getAttribute("textAlignment")?.toLocaleLowerCase() || "";
        const link = getLink(el.getAttribute("diagramTitle") || "");
        const kks = el.getAttribute("kks") || "";

        const fontData = el.querySelector("Font")?.getAttribute("name") || "Tahoma";
        const fontDataParts = fontData.split(" ");
        const fontName = fontDataParts[0];
        const fontStyle = fontDataParts[1] || "normal";
        const size = parseFloat(el.querySelector("Font")?.getAttribute("size") || "12");

        const buttonColor = el.querySelector("buttonNonPressedColor Color");
        const red = parseFloat(buttonColor?.getAttribute("red") || "0");
        const green = parseFloat(buttonColor?.getAttribute("green") || "0");
        const blue = parseFloat(buttonColor?.getAttribute("blue") || "0");
        const opacity = parseFloat(buttonColor?.getAttribute("opacity") || "0");

        const buttonColor2 = el.querySelector("buttonPressedColor Color");
        const red2 = parseFloat(buttonColor2?.getAttribute("red") || "0");
        const green2 = parseFloat(buttonColor2?.getAttribute("green") || "0");
        const blue2 = parseFloat(buttonColor2?.getAttribute("blue") || "0");
        const opacity2 = parseFloat(buttonColor2?.getAttribute("opacity") || "0");

        parsedElements.push({
          id: count++,
          type: "Button",
          x,
          y,
          height,
          width,
          buttonOnText,
          buttonOffText,
          textAlignment,
          link,
          red,
          green,
          blue,
          opacity,
          red2,
          green2,
          blue2,
          opacity2,
          kks,
          opacityMain,
          fontName,
          fontStyle,
          size,
        });
      } else if (equipmentType === "TEXT_BUTTON") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const buttonOnText = el.getAttribute("buttonOnText") || "";
        const buttonOffText = el.getAttribute("buttonOffText") || "";
        const opacityMain = parseFloat(el.getAttribute("opacity") || "1");
        const textAlignment = el.getAttribute("textAlignment")?.toLocaleLowerCase() || "";
        const kks = el.getAttribute("kks") || "";

        const borderWidth = parseFloat(el.getAttribute("borderWidth") || "0");
        const borderColor = el.getAttribute("borderPaint") || "";

        const fontData = el.querySelector("Font")?.getAttribute("name") || "Tahoma";
        const fontDataParts = fontData.split(" ");
        const fontName = fontDataParts[0];
        const fontStyle = fontDataParts[1] || "normal";
        const size = parseFloat(el.querySelector("Font")?.getAttribute("size") || "12");

        const buttonColor = el.querySelector("buttonNonPressedColor Color");
        const red = parseFloat(buttonColor?.getAttribute("red") || "0");
        const green = parseFloat(buttonColor?.getAttribute("green") || "0");
        const blue = parseFloat(buttonColor?.getAttribute("blue") || "0");
        const opacity = parseFloat(buttonColor?.getAttribute("opacity") || "0");

        const buttonColor2 = el.querySelector("buttonPressedColor Color");
        const red2 = parseFloat(buttonColor2?.getAttribute("red") || "0");
        const green2 = parseFloat(buttonColor2?.getAttribute("green") || "0");
        const blue2 = parseFloat(buttonColor2?.getAttribute("blue") || "0");
        const opacity2 = parseFloat(buttonColor2?.getAttribute("opacity") || "0");
        const interactive = el.getAttribute("interactive") || "";

        parsedElements.push({
          id: count++,
          type: "ButtonText",
          x,
          y,
          height,
          width,
          buttonOnText,
          buttonOffText,
          textAlignment,
          kks,
          red,
          green,
          blue,
          opacity,
          red2,
          green2,
          blue2,
          opacity2,
          opacityMain,
          fontName,
          fontStyle,
          size,
          borderWidth,
          borderColor,
          interactive,
        });
      } else if (equipmentType === "XMD") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const kks = el.getAttribute("kks") || "";
        const buttonOnText = el.getAttribute("buttonOnText") || "";
        const buttonOffText = el.getAttribute("buttonOffText") || "";
        const buttonColor = el.querySelector("buttonNonPressedColor Color");
        const red = parseFloat(buttonColor?.getAttribute("red") || "0");
        const green = parseFloat(buttonColor?.getAttribute("green") || "0");
        const blue = parseFloat(buttonColor?.getAttribute("blue") || "0");

        const buttonColor2 = el.querySelector("buttonPressedColor Color");
        const red2 = parseFloat(buttonColor2?.getAttribute("red") || "0");
        const green2 = parseFloat(buttonColor2?.getAttribute("green") || "0");
        const blue2 = parseFloat(buttonColor2?.getAttribute("blue") || "0");

        parsedElements.push({
          id: count++,
          type: "ButtonXMD",
          x,
          y,
          height,
          width,
          kks,
          buttonOnText,
          buttonOffText,
          red,
          green,
          blue,
          red2,
          green2,
          blue2,
        });
      } else if (equipmentType === "RETURN_BUTTON") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const kks = el.getAttribute("kks") || "";
        const buttonOnText = el.getAttribute("buttonOnText") || "";
        const buttonOffText = el.getAttribute("buttonOffText") || "";
        const opacity = parseFloat(el.getAttribute("opacity") || "1");
        const borderWidth = parseFloat(el.getAttribute("borderWidth") || "0");
        const borderColor = el.getAttribute("borderPaint") || "";
        const buttonColor = el.querySelector("buttonNonPressedColor Color");
        const red = parseFloat(buttonColor?.getAttribute("red") || "0");
        const green = parseFloat(buttonColor?.getAttribute("green") || "0");
        const blue = parseFloat(buttonColor?.getAttribute("blue") || "0");
        const buttonColor2 = el.querySelector("buttonPressedColor Color");
        const red2 = parseFloat(buttonColor2?.getAttribute("red") || "0");
        const green2 = parseFloat(buttonColor2?.getAttribute("green") || "0");
        const blue2 = parseFloat(buttonColor2?.getAttribute("blue") || "0");
        const fontData = el.querySelector("Font")?.getAttribute("name") || "Tahoma";
        const fontDataParts = fontData.split(" ");
        const fontName = fontDataParts[0];
        const fontStyle = fontDataParts[1] || "normal";
        const size = parseFloat(el.querySelector("Font")?.getAttribute("size") || "12");

        parsedElements.push({
          id: count++,
          type: "ButtonReturn",
          x,
          y,
          height,
          width,
          kks,
          buttonOnText,
          buttonOffText,
          red,
          green,
          blue,
          red2,
          green2,
          blue2,
          opacity,
          borderWidth,
          borderColor,
          fontName,
          fontStyle,
          size,
        });
      }
    } else if (el.nodeName === "InputControl") {
      const x = parseFloat(el.getAttribute("layoutX") || "0");
      const y = parseFloat(el.getAttribute("layoutY") || "0");
      const height = parseFloat(el.getAttribute("prefHeight") || "0");
      const width = parseFloat(el.getAttribute("prefWidth") || "0");
      const kks = el.getAttribute("kks") || "";
      const decimals = parseFloat(el.getAttribute("decimals") || "2");
      const maxValue = parseFloat(el.getAttribute("maxValue") || "0");
      const customFontEl = el?.getElementsByTagName("customFont")[0];
      const customFont = customFontEl?.getElementsByTagName("Font")[0];
      const fontSize = parseFloat(customFont?.getAttribute("size") || "0");
      const fontName = customFont?.getAttribute("name") || "";
      const interactive = el.getAttribute("interactive") || "";

      parsedElements.push({
        id: count++,
        type: "InputControl",
        x,
        y,
        height,
        width,
        kks,
        decimals,
        maxValue,
        fontSize,
        fontName,
        interactive,
      });
    } else if (el.nodeName === "ElectricControl") {
      const equipmentType = el.getAttribute("equipmentType") || "BRK";
      if (equipmentType === "BRKD") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const kks = el.getAttribute("kks") || "";
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const rotate = el.getAttribute("orientation") || "HORIZONTAL";

        const strokeColorEl = el.getElementsByTagName("strokeColor")[0];
        const strokeColor = strokeColorEl.getElementsByTagName("Color")[0];
        const red = parseFloat(strokeColor.getAttribute("red") || "0");
        const green = parseFloat(strokeColor.getAttribute("green") || "0");
        const blue = parseFloat(strokeColor.getAttribute("blue") || "0");
        const description = "";

        parsedElements.push({
          id: count++,
          type: "ElectricControlBRKD",
          x,
          y,
          height,
          width,
          kks,
          red,
          green,
          blue,
          rotate,
          description,
        });
      } else if (equipmentType === "BRKG") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const kks = el.getAttribute("kks") || "";
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const rotate = el?.getAttribute("orientation") || "HORIZONTAL";

        const strokeColorEl = el?.getElementsByTagName("strokeColor")[0];
        const strokeColor = strokeColorEl?.getElementsByTagName("Color")[0];
        const red = parseFloat(strokeColor?.getAttribute("red") || "0");
        const green = parseFloat(strokeColor?.getAttribute("green") || "0");
        const blue = parseFloat(strokeColor?.getAttribute("blue") || "0");
        const description = "";

        parsedElements.push({
          id: count++,
          type: "ElectricControlBRKG",
          x,
          y,
          height,
          width,
          kks,
          red,
          green,
          blue,
          rotate,
          description,
        });
      } else if (equipmentType === "BRK") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const kks = el.getAttribute("kks") || "";
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const rotate = el?.getAttribute("orientation") || "HORIZONTAL";

        const strokeColorEl = el?.getElementsByTagName("strokeColor")[0];
        const strokeColor = strokeColorEl?.getElementsByTagName("Color")[0];
        const red = parseFloat(strokeColor?.getAttribute("red") || "0");
        const green = parseFloat(strokeColor?.getAttribute("green") || "0");
        const blue = parseFloat(strokeColor?.getAttribute("blue") || "0");
        const description = "";

        parsedElements.push({
          id: count++,
          type: "ElectricControlBreaker",
          x,
          y,
          height,
          width,
          kks,
          red,
          green,
          blue,
          rotate,
          description,
        });
      } else if (equipmentType === "BRK6") {
        const x = parseFloat(el.getAttribute("layoutX") || "0");
        const y = parseFloat(el.getAttribute("layoutY") || "0");
        const kks = el.getAttribute("kks") || "";
        const height = parseFloat(el.getAttribute("prefHeight") || "0");
        const width = parseFloat(el.getAttribute("prefWidth") || "0");
        const rotate = el?.getAttribute("orientation") || "HORIZONTAL";

        const strokeColorEl = el?.getElementsByTagName("strokeColor")[0];
        const strokeColor = strokeColorEl?.getElementsByTagName("Color")[0];
        const red = parseFloat(strokeColor?.getAttribute("red") || "0");
        const green = parseFloat(strokeColor?.getAttribute("green") || "0");
        const blue = parseFloat(strokeColor?.getAttribute("blue") || "0");
        const description = "";

        parsedElements.push({
          id: count++,
          type: "ElectricControlBRK6",
          x,
          y,
          height,
          width,
          kks,
          red,
          green,
          blue,
          rotate,
          description,
        });
      }
    }
  });

  return parsedElements;
  
};
