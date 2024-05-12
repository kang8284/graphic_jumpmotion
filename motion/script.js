let inputImage; // 이미지를 담을 변수
let inputVideo; // 비디오를 담을 변수
let poseNet;
let poses = [];
let lastPose;
let jumpThreshold = 100; // 점프 감지 임계값

function preload() {
    // 이미지를 preload() 함수 내에서 로드합니다.
    inputImage = loadImage('path/to/external/image.jpg');

    // 비디오를 preload() 함수 내에서 로드합니다.
    inputVideo = createVideo('path/to/external/video.mp4');
    inputVideo.hide(); // 비디오는 숨겨둡니다.
}

function setup() {
    createCanvas(640, 480);
    // PoseNet 모델을 사용하여 새로운 poseNet 객체 생성
    poseNet = ml5.poseNet(modelLoaded);
    // 새로운 'pose' 이벤트를 수신하도록 설정
    poseNet.on('pose', function (results) {
        poses = results;
    });
}

function modelLoaded() {
    console.log('모델 로드 완료!');
    detectPose(); // 포즈 감지 시작
}

function detectPose() {
    // 이미지 또는 비디오에서 포즈 감지
    poseNet.singlePose(inputImage || inputVideo, function (results) {
        poses = results;
        detectPose(); // 계속해서 감지
    });
}

function draw() {
    background(220);

    // 이미지 또는 비디오를 캔버스에 표시
    if (inputImage) {
        image(inputImage, 0, 0, width, height);
    } else if (inputVideo) {
        image(inputVideo, 0, 0, width, height);
    }

    // 감지된 포즈를 순회하며 그림
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        // 각 키포인트를 그림
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.2) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
        // 점프 동작을 확인
        if (lastPose) {
            let deltaY = pose.keypoints[0].position.y - lastPose.keypoints[0].position.y;
            if (deltaY < -jumpThreshold) {
                console.log("점프 감지!");
                // 점프를 감지했을 때 수행할 동작을 여기에 추가할 수 있음
            }
        }
        lastPose = pose;
    }
}