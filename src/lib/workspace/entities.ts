export const entityDefinitions = {
  "Routine": {
    "name": "Routine",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "agent_id": {
        "type": "string"
      },
      "schedule": {
        "type": "string"
      },
      "trigger_type": {
        "type": "string",
        "enum": [
          "time",
          "event"
        ],
        "default": "time"
      },
      "description": {
        "type": "string"
      },
      "enabled": {
        "type": "boolean",
        "default": true
      },
      "last_run": {
        "type": "string"
      },
      "next_run": {
        "type": "string"
      },
      "last_run_at": {
        "type": "string"
      },
      "next_run_at": {
        "type": "string"
      }
    },
    "required": [
      "name"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "Agent": {
    "name": "Agent",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "role_title": {
        "type": "string"
      },
      "tagline": {
        "type": "string"
      },
      "status": {
        "type": "string",
        "enum": [
          "idle",
          "working",
          "done",
          "paused"
        ],
        "default": "idle"
      },
      "current_task": {
        "type": "string"
      },
      "skills": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "tools": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "model": {
        "type": "string",
        "default": "Base 1"
      },
      "machine": {
        "type": "string"
      },
      "pinned": {
        "type": "boolean",
        "default": false
      }
    },
    "required": [
      "name",
      "role_title"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "WaitlistSignup": {
    "name": "WaitlistSignup",
    "type": "object",
    "properties": {
      "email": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "tier": {
        "type": "string",
        "enum": [
          "pro",
          "enterprise"
        ],
        "default": "pro"
      },
      "note": {
        "type": "string"
      }
    },
    "required": [
      "email"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {},
      "update": {
        "user_condition": {
          "role": "admin"
        }
      },
      "delete": {
        "user_condition": {
          "role": "admin"
        }
      }
    }
  },
  "ApprovalRule": {
    "name": "ApprovalRule",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "category": {
        "type": "string",
        "enum": [
          "money",
          "identity",
          "communication",
          "files",
          "infrastructure",
          "calendar"
        ],
        "default": "communication"
      },
      "requires_approval": {
        "type": "boolean",
        "default": true
      },
      "agent_id": {
        "type": "string"
      }
    },
    "required": [
      "name"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "BioLearning": {
    "name": "BioLearning",
    "type": "object",
    "properties": {
      "title": {
        "type": "string"
      },
      "category": {
        "type": "string",
        "enum": [
          "metabolism",
          "nutrition",
          "training",
          "rehab",
          "sensitivity"
        ],
        "default": "metabolism"
      },
      "content": {
        "type": "string"
      },
      "source": {
        "type": "string"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "required": [
      "title",
      "content"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "Conversation": {
    "name": "Conversation",
    "type": "object",
    "properties": {
      "title": {
        "type": "string"
      },
      "mode": {
        "type": "string",
        "enum": [
          "direct",
          "group"
        ],
        "default": "direct"
      },
      "agent_ids": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "preview": {
        "type": "string"
      },
      "unread": {
        "type": "number",
        "default": 0
      },
      "pinned": {
        "type": "boolean",
        "default": false
      }
    },
    "required": [
      "title"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "EngineKey": {
    "name": "EngineKey",
    "type": "object",
    "properties": {
      "label": {
        "type": "string"
      },
      "key": {
        "type": "string"
      },
      "subscription_tier": {
        "type": "string",
        "enum": [
          "free",
          "pro",
          "enterprise"
        ],
        "default": "free"
      },
      "daily_scans_used": {
        "type": "number",
        "default": 0
      },
      "usage_date": {
        "type": "string"
      },
      "max_rounds": {
        "type": "number",
        "default": 3
      }
    },
    "required": [
      "key"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "MealLog": {
    "name": "MealLog",
    "type": "object",
    "properties": {
      "title": {
        "type": "string"
      },
      "image_uri": {
        "type": "string"
      },
      "calories": {
        "type": "number"
      },
      "protein_g": {
        "type": "number"
      },
      "carbs_g": {
        "type": "number"
      },
      "fats_g": {
        "type": "number"
      },
      "micronutrients": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "glycemic_load": {
        "type": "number"
      },
      "summary": {
        "type": "string"
      },
      "diet_adjustment": {
        "type": "string"
      },
      "training_adjustment": {
        "type": "string"
      },
      "agent_trace": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "analyzed_on": {
        "type": "string"
      }
    },
    "required": [
      "title"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "MemoryNote": {
    "name": "MemoryNote",
    "type": "object",
    "properties": {
      "title": {
        "type": "string"
      },
      "kind": {
        "type": "string",
        "enum": [
          "preference",
          "fact",
          "file",
          "skill",
          "decision"
        ],
        "default": "fact"
      },
      "content": {
        "type": "string"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "source": {
        "type": "string"
      }
    },
    "required": [
      "title",
      "content"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "Message": {
    "name": "Message",
    "type": "object",
    "properties": {
      "conversation_id": {
        "type": "string"
      },
      "role": {
        "type": "string",
        "enum": [
          "user",
          "agent",
          "system"
        ],
        "default": "agent"
      },
      "agent_id": {
        "type": "string"
      },
      "kind": {
        "type": "string",
        "enum": [
          "text",
          "digest",
          "approval",
          "proactive"
        ],
        "default": "text"
      },
      "content": {
        "type": "string"
      },
      "title": {
        "type": "string"
      },
      "items": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "anchors": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "meal_log_id": {
        "type": "string"
      },
      "status": {
        "type": "string",
        "enum": [
          "none",
          "pending",
          "approved",
          "changes",
          "declined"
        ],
        "default": "none"
      },
      "position": {
        "type": "number",
        "default": 0
      }
    },
    "required": [
      "conversation_id",
      "content"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "RehabProtocol": {
    "name": "RehabProtocol",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "focus": {
        "type": "string"
      },
      "stage": {
        "type": "string",
        "enum": [
          "early",
          "mid",
          "late",
          "maintenance"
        ],
        "default": "early"
      },
      "guardrail": {
        "type": "string"
      },
      "weekly_sessions": {
        "type": "number",
        "default": 3
      },
      "status": {
        "type": "string",
        "enum": [
          "active",
          "paused",
          "complete"
        ],
        "default": "active"
      },
      "notes": {
        "type": "string"
      }
    },
    "required": [
      "name"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "SyncJob": {
    "name": "SyncJob",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "source": {
        "type": "string"
      },
      "target": {
        "type": "string"
      },
      "direction": {
        "type": "string",
        "enum": [
          "pull",
          "push",
          "two-way"
        ],
        "default": "two-way"
      },
      "cadence": {
        "type": "string",
        "default": "Every 15 minutes"
      },
      "endpoint": {
        "type": "string"
      },
      "enabled": {
        "type": "boolean",
        "default": true
      },
      "last_run": {
        "type": "string"
      }
    },
    "required": [
      "name"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  },
  "AgentAction": {
    "name": "AgentAction",
    "type": "object",
    "properties": {
      "agent_id": {
        "type": "string"
      },
      "conversation_id": {
        "type": "string"
      },
      "action": {
        "type": "string"
      },
      "summary": {
        "type": "string"
      },
      "status": {
        "type": "string",
        "enum": [
          "pending",
          "completed",
          "blocked",
          "failed"
        ],
        "default": "completed"
      },
      "risk": {
        "type": "string",
        "enum": [
          "low",
          "medium",
          "high"
        ],
        "default": "low"
      }
    },
    "required": [
      "action"
    ],
    "rls": {
      "read": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "create": {
        "created_by_id": "{{user.id}}"
      },
      "update": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      },
      "delete": {
        "$or": [
          {
            "created_by_id": "{{user.id}}"
          },
          {
            "user_condition": {
              "role": "admin"
            }
          }
        ]
      }
    }
  }
} as const;
export type Entity = keyof typeof entityDefinitions;
export type FieldDefinition = {type: string; enum?: readonly string[]; default?: unknown; description?: string; items?: {type:string}};
export type EntityDefinition = {name:string; properties:Record<string,FieldDefinition>; required:readonly string[]};
export const entities = Object.keys(entityDefinitions) as Entity[];
export function definition(entity: Entity): EntityDefinition { return entityDefinitions[entity]; }
export const entityPaths: Record<Entity,string> = {Agent:"agents",ApprovalRule:"approvals",BioLearning:"learnings",Conversation:"conversations",EngineKey:"engine-keys",MealLog:"meals",MemoryNote:"memory",Message:"messages",RehabProtocol:"rehab",Routine:"routines",SyncJob:"syncs",AgentAction:"activity",WaitlistSignup:"waitlist"};
