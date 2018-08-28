# Design Patterns used

## Fail early and fail loud

I've used `require` statements to check for a condition as early as possible in the function body so that it will throw an exception if the condition is not met. This helps prevent unnecessary code execution in the event that an exception will be thrown.

## Restricting Access

I've used restrict function access so that only specific addresses are permitted to execute functions. For example, only the requester of a transcription can choose which transcriber to reward whereas anyone can distribute a reward if the original requester is a no show.

## Mortal

If the requester has rewarded a transcriber or if the requester is a no show and someone has initiated the `noShow` function, the contract will selfdestruct, distribute the reward to the specific parties, and remove itself from the blockchain to prevent further interaction.
