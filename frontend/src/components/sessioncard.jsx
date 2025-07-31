import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ExternalLink, Edit, Trash2 } from 'lucide-react';

const SessionCard = ({ session, showActions = false, onDelete }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const statusStyles = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const statusColor = statusStyles[session.status] || statusStyles.default;

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Title and Status */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {session.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
          {session.status}
        </span>
      </div>

      {/* Tags */}
      {session.tags?.length > 0 && (
        <div className="flex items-center mb-3">
          <Tag size={16} className="text-gray-400 mr-2" />
          <div className="flex flex-wrap gap-2">
            {session.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {session.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{session.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Calendar size={16} className="mr-2" />
        <span>Created {formatDate(session.createdAt)}</span>
        {session.updatedAt !== session.createdAt && (
          <span className="ml-2">• Updated {formatDate(session.updatedAt)}</span>
        )}
      </div>

      {/* Footer: View JSON & Actions */}
      <div className="flex items-center justify-between">
        <a
          href={session.json_file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          <ExternalLink size={16} className="mr-1" />
          View JSON
        </a>

        {showActions && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/sessions/edit/${session._id}`}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              title="Edit session"
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={() => onDelete(session._id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete session"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
