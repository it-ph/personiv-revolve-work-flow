<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class Test implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $notification;

    protected $recipient;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($notification, $recipient)
    {
        $this->notification = $notification;
        $this->recipient = $recipient;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return ['user.'.$this->recipient->id];
    }
}
