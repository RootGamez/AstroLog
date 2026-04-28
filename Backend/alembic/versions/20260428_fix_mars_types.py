"""fix mars_explorations column types
Revision ID: 20260428_fix_mars_types
Revises: ffba5f9a2b85
Create Date: 2026-04-28 22:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20260428_fix_mars_types'
down_revision = 'ffba5f9a2b85'
branch_labels = None
depends_on = None


def upgrade():
    # Convert is_favorite stored as text to boolean
    op.execute(
        """
        ALTER TABLE mars_explorations
        ALTER COLUMN is_favorite TYPE boolean USING (
            CASE
                WHEN lower(is_favorite::text) IN ('t','true','1') THEN true
                WHEN lower(is_favorite::text) IN ('f','false','0') THEN false
                ELSE NULL
            END
        );
        """
    )

    # Convert created_at stored as text to timestamp without time zone
    op.execute(
        """
        ALTER TABLE mars_explorations
        ALTER COLUMN created_at TYPE TIMESTAMP USING (created_at::timestamp);
        """
    )

    # Set a sensible default for created_at
    op.execute("ALTER TABLE mars_explorations ALTER COLUMN created_at SET DEFAULT now();")


def downgrade():
    # Revert created_at to text
    op.execute("ALTER TABLE mars_explorations ALTER COLUMN created_at TYPE VARCHAR USING created_at::varchar;")
    # Revert is_favorite to varchar ('true'/'false')
    op.execute("ALTER TABLE mars_explorations ALTER COLUMN is_favorite TYPE VARCHAR USING (CASE WHEN is_favorite THEN 'true' ELSE 'false' END);")
