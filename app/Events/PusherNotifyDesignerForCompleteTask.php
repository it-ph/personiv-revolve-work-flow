<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PusherNotifyDesignerForCompleteTask implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $data;

    public $sender;

    protected $recipient;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($data, $sender, $recipient)
    {
        $this->data = $data;
        $this->sender = $sender;
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
