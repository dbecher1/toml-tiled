//<reference types="@mapeditor/tiled-api" />

const orient = {
    0: "unknown",
    1: "orthogonal",
    2: "isometric",
    3: "staggered",
    4: "hexagonal"
}

let customMapFormat = {
    name: "TOML files",
    extension: "toml",

    write: function (map, fileName) {

        let file = new TextFile(fileName, TextFile.WriteOnly)

        file.writeLine("[map_data]")
        file.writeLine("path = \"" + fileName + "\"")
        file.writeLine("map.width = " + map.width)
        file.writeLine("map.height = " + map.height)
        file.writeLine("tile.width = " + map.tileWidth)
        file.writeLine("tile.height = " + map.tileHeight)
        file.writeLine("is_infinite = " + map.infinite)
        file.writeLine("num_layers = " + map.layerCount)
        file.writeLine("orientation = \"" + orient[map.orientation] + "\"\n")

        for (let l of map.layers) {
            if (l.isObjectGroup) {
                // TODO; not yet supported but soon to be
            }
            else if (l.isGroupLayer) {
                // NOT SUPPORTED YET
                break;
            }
            else if (l.isImageLayer) {
                // NOT SUPPORTED YET
                break;
            }
            else if (l.isTileLayer) {
                file.writeLine("[[layer]]")
                file.writeLine("name = \"" + l.name + "\"")
                file.writeLine("id = " + l.id)
                file.writeLine("width = " + l.width)
                file.writeLine("height = " + l.height)
                file.writeLine("offset.x = " + l.offset.x)
                file.writeLine("offset.y = " + l.offset.y)
                file.writeLine("opacity = " + l.opacity)
                file.writeLine("parallax.x = " + l.parallaxFactor.x)
                file.writeLine("parallax.y = " + l.parallaxFactor.y)
                file.writeLine("is_visible = " + l.visible)
                file.writeLine("data = [")

                for (let y = 0; y < l.height; y++) {
                    for (let x = 0; x < l.width; x++) {
                        let t = l.tileAt(x, y)
                        if (t == null) {
                            var id = -1
                        }
                        else {
                            var id = t.id
                        }
                        file.write(id + ", ")
                    }
                    file.writeLine("")
                }
                file.writeLine("]")
            }
            else {
                return "Something went horribly wrong..."
            }
            file.writeLine("")
        }
        file.commit()
    },
}
tiled.registerMapFormat("toml", customMapFormat);
