const { DeckGL, PointCloudLayer } = deck;
const { load } = loaders;
const { LASLoader } = loaders;

async function loadPointCloud(urls) {
    const data = [];

    for (const { url, getColor } of urls) {
        // 手动 fetch 以避免 MIME type 问题
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const pointCloud = await load(arrayBuffer, LASLoader);

        const positions = pointCloud.attributes.POSITION.value;

        for (let i = 0; i < positions.length; i += 3) {
            const height = positions[i + 2];

            data.push({
                position: [positions[i], positions[i + 1], positions[i + 2]],
                color: getColor(height),
            });
        }
    }

    return data;
}

const urls = [
    { url: './data/vegetation_points_wgs84.las', getColor: height => [height / 100 * 155, 155, 0] },
    { url: './data/ground_points_wgs84.las', getColor: height => [height / 10 * 255, height / 10 * 255, height / 10 * 255] },
    { url: './data/building_points_wgs84.las', getColor: height => [height / 100 * 255, height / 100 * 255, 155] },

    { url: './data/vegetation_points_wgs84_2.las', getColor: height => [height / 100 * 155, 155, 0] },
    { url: './data/ground_points_wgs84_2.las', getColor: height => [height / 10 * 255, height / 10 * 255, height / 10 * 255] },
    { url: './data/building_points_wgs84_2.las', getColor: height => [height / 100 * 255, height / 100 * 255, 155] },
];

// 初始化 DeckGL
let deckgl;
let data;
// 22.303689416341562, 114.17920702923537
// 初始化地图和视图
const initialViewState = {
    // 香港中心
    latitude:  22.303689416341562,
    longitude: 114.17920702923537,
    zoom: 17,
    pitch: 60,
    bearing: 0,
};

async function init() {
    data = await loadPointCloud(urls);

    // 创建 PointCloudLayer
    const layer = new PointCloudLayer({
        id: 'point-cloud-layer',
        data,
        pointSize: 2,
        getPosition: d => d.position,
        getColor: d => d.color,
    });

    // 初始化 DeckGL
    deckgl = new DeckGL({
        mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json', // 黑色地图
        // mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // 白色地图
        controller: true,
        initialViewState,
        layers: [layer],
        onViewStateChange: ({ viewState }) => {
            deckgl.setProps({ viewState });
        },
        container: 'map',
    });
}

init();