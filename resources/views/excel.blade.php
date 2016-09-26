<table>
	<tr>
		<th align="center">Delivery Date</th>
		<th align="center">Live Date</th>
		<th align="center">File Name</th>
		<th align="center">Client</th>
		<th align="center">Category</th>
		<th align="center">Designer</th>
		<th align="center">Time Start</th>
		<th align="center">Time End</th>
		<th align="center">Minutes Spent</th>
		<th align="center">QC</th>
		<th align="center">Time Start</th>
		<th align="center">Time End</th>
		<th align="center">Minutes Spent</th>
		<th align="center">Rework Designer</th>
		<th align="center">Rework Time Start</th>
		<th align="center">Rework Time End</th>
		<th align="center">Minutes Spent</th>
		<th align="center">Rework QC</th>
		<th align="center">Rework Time Start</th>
		<th align="center">Rework Time End</th>
		<th align="center">Minutes Spent</th>
		<th align="center">Status</th>
	</tr>
	@foreach($data as $task)
		<tr>
			<td align="center">{{ Carbon\Carbon::parse($task->delivery_date)->toDateString() }}</td>
			<td align="center">{{ Carbon\Carbon::parse($task->live_date)->toDateString() }}</td>
			<td align="center">{{ $task->file_name }}</td>
			<td align="center">{{ $task->client->name }}</td>
			<td align="center">{{ $task->category->name }}</td>
			<td align="center">
				{{ $task->designer_assigned->designer->name or '' }}
			</td>
			<td align="center">
				{{ isset($task->designer_assigned->time_start) ? Carbon\Carbon::parse($task->designer_assigned->time_start)->toDayDateTimeString() : '' }}
			</td>
			<td align="center">
				{{ isset($task->designer_assigned->time_end) ? Carbon\Carbon::parse($task->designer_assigned->time_end)->toDayDateTimeString() : '' }}
			</td>
			<td align="center">
				{{ isset($task->designer_assigned->minutes_spent) ? $task->designer_assigned->minutes_spent : '' }}
			</td>
			<td align="center">
				{{ isset($task->quality_control_assigned->quality_control->name) ? $task->quality_control_assigned->quality_control->name : '' }}
			</td>
			<td align="center">
				{{ isset($task->quality_control_assigned->time_start) ? Carbon\Carbon::parse($task->quality_control_assigned->time_start)->toDayDateTimeString() : '' }}
			</td>
			<td align="center">
				{{ isset($task->quality_control_assigned->time_end) ? Carbon\Carbon::parse($task->quality_control_assigned->time_end)->toDayDateTimeString() : '' }}
			</td>
			<td align="center">
				{{ isset($task->quality_control_assigned->minutes_spent) ? $task->quality_control_assigned->minutes_spent : '' }}
			</td>
			<td align="center">
				@if($task->rework)
					{{$task->rework->designer->name or '' }}
				@endif
			</td>
			<td align="center">
				@if($task->rework)
					{{ isset($task->rework->designer_time_start) ? Carbon\Carbon::parse($task->rework->designer_time_start)->toDayDateTimeString() : '' }}
				@endif
			</td>
			<td align="center">
				@if($task->rework)
					{{ isset($task->rework->designer_time_end) ? Carbon\Carbon::parse($task->rework->designer_time_end)->toDayDateTimeString() : '' }}
				@endif
			</td>
			<td align="center">
				@if($task->rework)
					{{ isset($task->rework->designer_minutes_spent) ? $task->rework->designer_minutes_spent : '' }}
				@endif
			</td>
			<td align="center">
				@if($task->rework)
					{{$task->rework->quality_control->name or '' }}
				@endif
			</td>
			<td align="center">
				@if($task->rework)
					{{ isset($task->rework->quality_control_time_start) ? Carbon\Carbon::parse($task->rework->quality_control_time_start)->toDayDateTimeString() : '' }}
				@endif
			</td>
			<td align="center">
				@if($task->rework)
					{{ isset($task->rework->quality_control_time_end) ? Carbon\Carbon::parse($task->rework->quality_control_time_end)->toDayDateTimeString() : '' }}
				@endif
			</td>
			<td align="center">
				@if($task->rework)
					{{ isset($task->rework->quality_control_minutes_spent) ? $task->rework->quality_control_minutes_spent : '' }}
				@endif
			</td>
			<td align="center">
				@if($task->status == 'pending')
					Pending
				@elseif($task->status == 'in_progress')
					In Progress
				@elseif($task->status == 'for_qc')
					For QC
				@elseif($task->status == 'rework')
					Rework
				@elseif($task->status == 'complete')
					Complete
				@endif
			</td>
		</tr>
	@endforeach
</table>