<?php

namespace w2gtools\sync;

// sync data structure
class sync_data {
    public $video_titles;

    public static function from_json(string $json): self {
        $raw_data = json_decode($json);
        
        $data = new sync_data;
        $data->video_titles = $raw_data->video_titles;

        return $data;
    }
}

// loads and saves data
interface i_storage_provider {
    public function load(): sync_data;
    public function save(sync_data $data): void;
}

// stores sync data in a json file
class json_storage_provider implements i_storage_provider {
    private $_storage_file;

    public function __construct(string $storage_file) {
        $this->_storage_file = $storage_file;
    }

    public function load(): sync_data {
        // throw new Exception("Storage file does not exist: {$this->_storage_file}");
        if (!file_exists($this->_storage_file))
            file_put_contents($this->_storage_file, json_encode(new sync_data, JSON_FORCE_OBJECT));
        
        return sync_data::from_json(file_get_contents($this->_storage_file));
    }

    public function save(sync_data $sync_data): void {
        $json_data = json_encode($sync_data, JSON_FORCE_OBJECT);
        file_put_contents($this->_storage_file, $json_data, LOCK_EX);
    }
}

// operates on sync data
interface i_sync_server {
    public function get_video_titles(): \stdClass;
    public function rename_video(string $title, string $new_title): void;
}

// sync server reference implementation
class sync_server implements i_sync_server {
    private $_storage_provider;

    public function __construct(i_storage_provider $storage_provider) {
        $this->_storage_provider = $storage_provider;
    }

    public function get_video_titles(): \stdClass {
        $data = $this->_storage_provider->load();
        return $data->video_titles;
    }

    public function rename_video(string $url, string $new_title): void {
        $data = $this->_storage_provider->load();

        if (empty($new_title))
            unset($data->video_titles->{$url});
        else
            $data->video_titles->{$url} = $new_title;

        $this->_storage_provider->save($data);
    }
};