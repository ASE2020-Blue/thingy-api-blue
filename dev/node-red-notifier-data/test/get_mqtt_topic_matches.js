class TopicTestInput {

    constructor(config, topic, expected) {
        this.config = config;
        this.topic = topic;
        this.expected = expected;
    }
}

const topics = [
    new TopicTestInput("things/+/shadow/update", "things/blue-3/shadow/update", ["blue-3"]),
    new TopicTestInput("things/shadow/update", "things/blue-3/shadow/update", []),
    new TopicTestInput("part1/+/mid/+/end", "part1/part2/mid/before-end/end", ["part2", "before-end"]),
    new TopicTestInput("part1/#", "part1/level1/level2/level3", ["level1/level2/level3"]),
    new TopicTestInput("part1/+/mid/#", "part1/part2/mid/level1/level2/level3", ["part2", "level1/level2/level3"])
];


function get_matches (topicConfig, topic) {
    let groupCaptureRegex = topicConfig.replace(/\+/g, "(.+)").replace(/#$/, "(.+)$");

    return (topic.match(new RegExp(groupCaptureRegex)) || [null])
        .slice(1); // skip entire match at index 0
}

function match_array (a1, a2) {
    if (a1.length !== a2.length)
        return false;

    for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i])
            return false;
    }

    return true;
}

for (let topicInput of topics) {
    const { config, topic, expected } = topicInput;
    let matches = get_matches(config, topic);
    if ( ! match_array(matches, expected))
        throw new Error("Not equal: " + matches + " vs " + expected);
}

console.log("Passed")