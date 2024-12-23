"""empty message

Revision ID: 09907f7675df
Revises: 
Create Date: 2024-12-20 19:06:40.419381

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '09907f7675df'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categories',
    sa.Column('id_category', sa.Integer(), nullable=False),
    sa.Column('category', sa.String(length=80), nullable=False),
    sa.PrimaryKeyConstraint('id_category'),
    sa.UniqueConstraint('category')
    )
    op.create_table('groups',
    sa.Column('id_group', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('description', sa.String(length=120), nullable=True),
    sa.PrimaryKeyConstraint('id_group'),
    sa.UniqueConstraint('name')
    )
    op.create_table('roles',
    sa.Column('id_rol', sa.Integer(), nullable=False),
    sa.Column('rol', sa.String(length=80), nullable=False),
    sa.PrimaryKeyConstraint('id_rol'),
    sa.UniqueConstraint('rol')
    )
    op.create_table('types',
    sa.Column('id_type', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(length=80), nullable=False),
    sa.PrimaryKeyConstraint('id_type'),
    sa.UniqueConstraint('type')
    )
    op.create_table('users',
    sa.Column('id_user', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('id_group', sa.Integer(), nullable=True),
    sa.Column('id_rol', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['id_group'], ['groups.id_group'], ),
    sa.ForeignKeyConstraint(['id_rol'], ['roles.id_rol'], ),
    sa.PrimaryKeyConstraint('id_user'),
    sa.UniqueConstraint('email')
    )
    op.create_table('finances',
    sa.Column('id_finance', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('description', sa.String(length=120), nullable=True),
    sa.Column('id_category', sa.Integer(), nullable=False),
    sa.Column('id_user', sa.Integer(), nullable=False),
    sa.Column('id_type', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['id_category'], ['categories.id_category'], ),
    sa.ForeignKeyConstraint(['id_type'], ['types.id_type'], ),
    sa.ForeignKeyConstraint(['id_user'], ['users.id_user'], ),
    sa.PrimaryKeyConstraint('id_finance'),
    sa.UniqueConstraint('name')
    )
    op.create_table('group__finances',
    sa.Column('id_group_finance', sa.Integer(), nullable=False),
    sa.Column('id_group', sa.Integer(), nullable=False),
    sa.Column('id_finance', sa.Integer(), nullable=False),
    sa.Column('create_by', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['create_by'], ['users.id_user'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['id_finance'], ['finances.id_finance'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['id_group'], ['groups.id_group'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id_group_finance')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('group__finances')
    op.drop_table('finances')
    op.drop_table('users')
    op.drop_table('types')
    op.drop_table('roles')
    op.drop_table('groups')
    op.drop_table('categories')
    # ### end Alembic commands ###
